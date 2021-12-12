/** @jsx jsx */
import { jsx } from "@emotion/react";

import { formatMoney } from "../Utils/formatMoney";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { player } from "../../Fixtures/player";
import { subwayStations } from "../../Fixtures/subwayStations";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsScreen = () => {
    const { layout } = useWindowSize();
    const {
        state: { currentStation },
    } = useGameState();
    const turnsLeft = 24;

    const station = subwayStations.find(
        (station) => station.key === currentStation,
    );

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
                    color: Colors.Text.secondary,
                    wordSpacing: 0,
                },
            }}
        >
            <div
                css={{
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.standard,
                    borderRadius: "7px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <p>Hours left: {turnsLeft}</p>
                <small>
                    <em>When your turns run out, the game is over.</em>
                </small>
            </div>
            <div
                css={{
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.standard,
                    borderRadius: "7px",
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <p>Health: {player.health}</p>
                <small>
                    <em>
                        If this drops to zero, you&apos;re dead! Get patched up
                        at the Free Clinic in Venice Beach.
                    </em>
                </small>

                <p>Cash: {formatMoney(player.cash)}</p>
                <small>
                    <em>
                        Keep hustling to grow this sum, but don&apos;t lose it
                        to a mugger.
                    </em>
                </small>

                <p css={{ color: Colors.Text.danger }}>
                    Debt: {player && formatMoney(player.debt)}
                </p>
                <small>
                    <em>
                        Don&apos;t let the interest get out of hand. It grows at
                        5% each hour.
                    </em>
                </small>
            </div>

            <div
                css={{
                    paddingBlockStart,
                    paddingBlockEnd,
                    paddingInline,
                    borderColor: Colors.Border.standard,
                    borderRadius: "7px",
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
