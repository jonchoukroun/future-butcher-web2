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
    const marginBlockEnd = layout === "full" ? "10px" : "2px";
    const paddingBlockStart = layout === "full" ? "28px" : "7px";
    const paddingBlockEnd = layout === "full" ? "20px" : "5px";
    const paddingInline = layout === "full" ? "28px" : "7px";

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                paddingInline: containerPaddingInline,
                paddingBlockEnd: layout === "compact" ? "50px" : 0,
                "& p": {
                    margin: 0,
                    fontFamily: "Share Tech Mono",
                    wordSpacing: 0,
                },
                "& small": {
                    display: "block",
                    marginBlockEnd,
                    marginBlockStart: "2px",
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.subtle,
                    wordSpacing: 0,
                },
            }}
        >
            <div
                css={{
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.base,
                    borderRadius: "2px",
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
                    <p>
                        <span css={{ marginInlineEnd: "5px" }}>
                            <FontAwesomeIcon icon={faHeart} />
                        </span>
                        {player && player.health}
                    </p>

                    <p>{player && formatMoney(player.funds)}</p>
                </div>

                <p css={{ color: Colors.Text.danger }}>
                    Debt: {player && formatMoney(player.debt)}
                </p>
                <small>
                    <em>Interest rate: 5% per hour</em>
                </small>
            </div>

            <div
                css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.base,
                    borderRadius: "2px",
                    borderStyle: "solid",
                    borderWidth: "1px",

                    "& button": {
                        marginBlockStart: layout === "full" ? "-10px" : "-2px",
                    },
                }}
            >
                <div>
                    <p>
                        <span css={{ marginInlineEnd: "5px" }}>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        {turnsLeft && getTimeLeft(turnsLeft)}
                    </p>
                    <small>
                        <em>{turnsLeft} hours left.</em>
                    </small>
                </div>
                <ButtonPrimary
                    label={"End Game"}
                    type={"Full"}
                    border={"None"}
                    isDanger={true}
                    clickCB={handleEndGameClick}
                />
            </div>

            <div
                css={{
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.base,
                    borderRadius: "2px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <p>Current Station: {station?.name}</p>
                <small>
                    <em>{station?.stationDescription}</em>
                </small>

                <p>
                    {currentStation === "compton"
                        ? "Total anarchy. No single gang is in change here."
                        : `Run by: ${station?.gangName}`}
                </p>
                <small>{station?.gangDescription}</small>

                <p>Reputation: Hunted</p>
                <small>
                    <em>
                        Too many sticks has drawn the attention of the locals.
                        Watch your back.
                    </em>
                </small>
            </div>
        </div>
    );
};
