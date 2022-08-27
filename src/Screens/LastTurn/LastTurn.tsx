/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useCallback, useEffect, useState } from "react";

import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";

export const LastTurn = () => {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) throw new Error("State is undefined");

    const { handleEndGame, handlePushCallback } = useChannel();

    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [buttonLabel, setButtonLabel] = useState(DEFAULT_BUTTON_LABEL);
    const [buttonCB, setButtonCB] = useState<() => void>(
        () => handleRetireClick,
    );
    const [isLoading, setIsLoading] = useState(false);

    const { debt, funds, pack, totalPackSpace } = player;

    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });
    const hasCuts = spaceAvailable < totalPackSpace;

    const handleVisitMarketClick = useCallback(() => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
    }, [dispatch]);

    const handlePayDebtClick = useCallback(async () => {
        if (isLoading) return;

        if (!debt) {
            handleMessage(
                "Tried to pay non-existent debt from LastTurn screen",
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

        dispatch({ type: "updateStateData", stateData: response });
        setContent([...DEFAULT_CONTENT, ...DID_PAY_DEBT_CONTENT]);
        setIsLoading(false);
    }, [debt, dispatch, funds, handlePushCallback, isLoading]);

    const handleRetireClick = useCallback(async () => {
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
        const score = debt > 0 ? 0 : funds;
        const highScores = await handleEndGame(hashId, score);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "setHighScores", highScores });
        dispatch({ type: "changeScreen", screen: Screen.GameResult });
    }, [debt, dispatch, funds, handleEndGame, isLoading]);

    useEffect(() => {
        if (hasCuts) {
            setContent([...DEFAULT_CONTENT, ...HAS_CUTS_CONTENT]);
            setButtonLabel(HAS_CUTS_BUTTON_LABEL);
            setButtonCB(() => handleVisitMarketClick);
        } else if (debt && debt > 0) {
            setContent([
                ...DEFAULT_CONTENT,
                ...HAS_DEBT_CONTENT,
                ...(funds >= debt ? CAN_PAY_DEBT_CONTENT : []),
            ]);
            setButtonLabel(
                funds >= debt
                    ? CAN_PAY_DEBT_BUTTON_LABEL
                    : DEFAULT_BUTTON_LABEL,
            );
            const cb = funds >= debt ? handlePayDebtClick : handleRetireClick;
            setButtonCB(() => cb);
        } else {
            setContent([...DEFAULT_CONTENT, ...NO_LOOSE_ENDS_CONTENT]);
            setButtonLabel(DEFAULT_BUTTON_LABEL);
            setButtonCB(() => handleRetireClick);
        }
    }, [
        debt,
        funds,
        handlePayDebtClick,
        handleRetireClick,
        handleVisitMarketClick,
        hasCuts,
    ]);

    return (
        <ScreenTemplate
            title={"Ready to Retire?"}
            content={content}
            primaryButtonLabel={buttonLabel}
            primaryIsLoading={false}
            primaryClickCB={buttonCB}
        />
    );
};

const DEFAULT_CONTENT = [
    "Your 24 hours are up.",
    "The coyote is waiting to take you across the border to Mexico.",
];
const DEFAULT_BUTTON_LABEL = "Finish the game";

const HAS_CUTS_CONTENT = [
    "",
    "But you're still carrying meat.",
    "Sell it at the market before you retire.",
];
const HAS_CUTS_BUTTON_LABEL = "Visit the market";

const HAS_DEBT_CONTENT = [
    " ",
    "But you still owe the bank money.",
    "If you try to leave without paying, the bank's Community Relations squad will track you down.",
];
const CAN_PAY_DEBT_CONTENT = [
    "Fortunately you have enough cash to pay your debt.",
];
const CAN_PAY_DEBT_BUTTON_LABEL = "Pay debt with FlayPal";
const DID_PAY_DEBT_CONTENT = [
    "",
    "You paid your debt.",
    "Now it's time to go.",
];

const NO_LOOSE_ENDS_CONTENT = [
    "   ",
    "You tied up all loose ends and it's time to go.",
];
