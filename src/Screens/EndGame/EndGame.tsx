/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";

export const EndGame = () => {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) throw new Error("State is undefined");

    const { handleEndGame, handlePushCallback } = useChannel();

    const { debt, funds, pack, totalPackSpace } = player;

    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });
    const hasCuts = spaceAvailable < totalPackSpace;

    const contentRef = useRef(DEFAULT_CONTENT);
    const [buttonLabel, setButtonLabel] = useState(DEFAULT_BUTTON_LABEL);

    const [buttonCB, setButtonCB] = useState<() => void>(
        () => handleRetireClick,
    );
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;

        if (hasCuts) {
            unstable_batchedUpdates(() => {
                contentRef.current.push(...HAS_CUTS_CONTENT);
                setButtonLabel(HAS_CUTS_BUTTON_LABEL);
                setButtonCB(() => handleVisitMarketClick);
            });
        } else if (debt && debt > 0) {
            unstable_batchedUpdates(() => {
                contentRef.current.push(
                    ...HAS_DEBT_CONTENT,
                    ...(funds >= debt ? CAN_PAY_DEBT_CONTENT : []),
                );
                setButtonLabel(
                    funds >= debt
                        ? CAN_PAY_DEBT_BUTTON_LABEL
                        : HAS_UNPAYABL_DEBT_BUTTON_LABEL,
                );
                const cb =
                    funds >= debt ? handlePayDebtClick : handleRetireClick;
                setButtonCB(() => cb);
            });
        } else {
            unstable_batchedUpdates(() => {
                contentRef.current.push(...NO_LOOSE_ENDS_CONTENT);
                setButtonLabel(DEFAULT_BUTTON_LABEL);
                setButtonCB(() => handleRetireClick);
            });
        }
    }, [debt, funds, hasCuts]);

    const handleVisitMarketClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
    };

    const handlePayDebtClick = async () => {
        if (isLoading) return;

        if (!debt) {
            handleMessage(
                "Tried to pay non-existent debt from EndGame",
                MessageLevel.Error,
            );
            return;
        }

        if (debt > funds) {
            handleMessage("Failed debt payment validation", MessageLevel.Error);
            return;
        }

        setIsLoading(true);

        const response = await handlePushCallback("payDebt", {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData: response });
            setIsLoading(false);
        });
    };

    const handleRetireClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            handleMessage(
                "Cannot end game without a hash ID",
                MessageLevel.Error,
            );
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        const score = player.funds;
        const highScores = await handleEndGame(hashId, score);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        if (score > 0) {
            localStorage.setItem("playerScore", score.toString());
        }
        unstable_batchedUpdates(() => {
            dispatch({ type: "setHighScores", highScores });
            dispatch({ type: "changeScreen", screen: Screen.HighScores });
        });
    };

    return (
        <ScreenTemplate
            title={"Ready to Retire?"}
            content={Array.from(new Set(contentRef.current))}
            buttonLabel={buttonLabel}
            isLoading={false}
            clickCB={buttonCB}
        />
    );
};

const DEFAULT_CONTENT = [
    "Your 24 hours are up.",
    "The coyote is waiting to take you across the border to Mexico.",
];
const DEFAULT_BUTTON_LABEL = "Take a ride";

const HAS_CUTS_CONTENT = [
    "",
    "You're still carrying meat.",
    "Sell it at the market before you retire.",
];
const HAS_CUTS_BUTTON_LABEL = "Visit the market";

const HAS_DEBT_CONTENT = [
    " ",
    "You still owe the bank money.",
    "If you try to leave without paying, they'll track you down.",
];

const HAS_UNPAYABL_DEBT_BUTTON_LABEL = "Try sneaking away";

const CAN_PAY_DEBT_CONTENT = [
    "Fortunately you have enough cash to pay your debt.",
];

const CAN_PAY_DEBT_BUTTON_LABEL = "Pay debt with FlayPal";

const NO_LOOSE_ENDS_CONTENT = [
    "   ",
    "You tied up all loose ends and it's time to go.",
];
