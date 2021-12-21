/** @jsx jsx */
import { jsx } from "@emotion/react";
import { faClock, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { formatMoney, getTimeLeft } from "../Utils";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { subwayStations } from "../../Fixtures/subwayStations";
import { useChannel, Callback } from "../../PhoenixChannel/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsScreen = () => {
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const { layout } = useWindowSize();
    const {
        state: { currentStation, turnsLeft, player },
        dispatch,
    } = useGameState();

    if (
        currentStation === undefined ||
        player === undefined ||
        turnsLeft === undefined
    ) {
        throw new Error("State is undefined");
    }

    const station = subwayStations.find(
        (station) => station.key === currentStation,
    );

    const { handleEndGame, handlePushCallback } = useChannel();
    const handleEndGameClick = async () => {
        if (isLoading) return;

        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            throw new Error("Cannot end game without a hash ID");
        }
        setIsLoading(true);
        const highScores = await handleEndGame(hashId, 0);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        unstable_batchedUpdates(() => {
            dispatch({ type: "setHighScores", highScores });
            dispatch({ type: "changeScreen", screen: Screen.HighScores });
        });
        if (isMountedRef.current) {
            setIsLoading(false);
        }
    };

    const canAfford = player?.funds > player?.debt;
    const handlePayDebtClick = async () => {
        if (isLoading) return;
        if (!canAfford) return;

        setIsLoading(true);
        const response = await handlePushCallback(Callback.payDebt, {});
        if (response !== undefined) {
            dispatch({ type: "updateStateData", stateData: response });
        }
        if (isMountedRef.current) {
            setIsLoading(false);
        }
    };

    const containerPaddingInline = layout === "full" ? "16px" : "4px";
    const paddingBlock = layout === "full" ? "28px" : "7px";
    const paddingInline = layout === "full" ? "28px" : "7px";

    return (
        <div
            css={{
                blockSize: "calc(100% - 70px)",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                paddingInline: containerPaddingInline,
                "& p": {
                    fontFamily: "Share Tech Mono",
                    wordSpacing: 0,
                },
            }}
        >
            <div
                css={{
                    inlineSize: "100%",
                    paddingBlock,
                    paddingInline,
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderRadius: "1px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <h3
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "15px",
                        fontFamily: "Michroma",
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                        textAlign: "center",
                    }}
                >
                    {player?.playerName}
                </h3>
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    paddingBlock,
                    paddingInline,
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderRadius: "1px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <div
                    css={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBlockEnd: "5px",
                    }}
                >
                    <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                        {player && formatMoney(player.funds)}
                    </p>

                    <p css={{ marginBlock: 0 }}>
                        <span css={{ marginInlineEnd: "5px" }}>
                            <FontAwesomeIcon icon={faHeart} fontSize={16} />
                        </span>
                        {player && player.health}
                    </p>
                </div>

                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBlockEnd: "5px",
                    }}
                >
                    <p
                        css={{
                            marginBlock: 0,
                            color: Colors.Text.danger,
                        }}
                    >
                        Debt: {player && formatMoney(player.debt)}{" "}
                        <span css={{ color: Colors.Text.subtle }}>(5%)</span>
                    </p>

                    {player.debt > 0 && canAfford && (
                        <ButtonPrimary
                            type={"Sized"}
                            label={"Pay Debt"}
                            border={"None"}
                            scheme={"Inverse"}
                            clickCB={handlePayDebtClick}
                        />
                    )}
                </div>
            </div>

            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBlock,
                    paddingInline,
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderRadius: "1px",
                    borderStyle: "solid",
                    borderWidth: "1px",

                    "& button": {
                        marginBlockStart: layout === "full" ? "-10px" : "-2px",
                    },
                }}
            >
                <div>
                    <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                        <span css={{ marginInlineEnd: "5px" }}>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        {turnsLeft && getTimeLeft(turnsLeft)}
                    </p>
                    <p css={{ marginBlock: 0, color: Colors.Text.subtle }}>
                        {turnsLeft} hours left
                    </p>
                </div>
                <ButtonPrimary
                    type={"Sized"}
                    label={"End Game"}
                    scheme={"Inverse"}
                    border={"None"}
                    isDanger={true}
                    clickCB={handleEndGameClick}
                />
            </div>

            <div
                css={{
                    paddingBlock,
                    paddingInline,
                }}
            >
                <h3
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "15px",
                        fontFamily: "Michroma",
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                        textAlign: "center",
                    }}
                >
                    {station?.name}
                </h3>

                <h4
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        fontFamily: "Michroma",
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                    }}
                >
                    {station?.gangName}
                </h4>
                <p
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        color: Colors.Text.subtle,
                    }}
                >
                    {station?.gangDescription}
                </p>

                <h4
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        fontFamily: "Michroma",
                        fontVariantCaps: "small-caps",
                    }}
                >
                    Hunted
                </h4>
                <p css={{ marginBlock: 0, color: Colors.Text.subtle }}>
                    Too many stick-ups has drawn the attention of the locals.
                    Watch your back.
                </p>
            </div>
        </div>
    );
};
