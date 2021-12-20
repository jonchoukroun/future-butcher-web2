/** @jsx jsx */
import { jsx } from "@emotion/react";
import { faClock, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { formatMoney, getTimeLeft } from "../Utils";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { subwayStations } from "../../Fixtures/subwayStations";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsScreen = () => {
    const { layout } = useWindowSize();
    const {
        state: { currentStation, turnsLeft, player },
        dispatch,
    } = useGameState();

    const station = subwayStations.find(
        (station) => station.key === currentStation,
    );

    const { handleEndGame } = useChannel();
    const handleEndGameClick = async () => {
        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            throw new Error("Cannot end game without a hash ID");
        }
        const highScores = await handleEndGame(hashId, 0);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        unstable_batchedUpdates(() => {
            dispatch({ type: "setHighScores", highScores });
            dispatch({ type: "changeScreen", screen: Screen.HighScores });
        });
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

                <p
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        color: Colors.Text.danger,
                    }}
                >
                    Debt: {player && formatMoney(player.debt)}{" "}
                    <span css={{ color: Colors.Text.subtle }}>(5%)</span>
                </p>
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
