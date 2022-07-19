/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { StationKey, subwayStations } from "../../Fixtures/subwayStations";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    stationKey: StationKey;
}

export const SubwayStationItem = ({ stationKey }: SubwayStationItemProps) => {
    const {
        dispatch,
        state: { currentStation, turnsLeft },
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("State is undefined");

    const station = subwayStations.find(({ key }) => key === stationKey);
    if (station === undefined) throw new Error("Cannot find station");

    const { handlePushCallback } = useChannel();

    const [isLoading, setIsLoading] = useState(false);
    const handleTravel = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const stateData = await handlePushCallback(Callback.travel, {
            destination: stationKey,
        });

        if (stateData === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        const screen =
            stateData.rules.state === "mugging"
                ? Screen.Mugging
                : stateData.station.station_name === StationKey.bellGardens
                ? Screen.SurplusStore
                : Screen.Market;
        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData });
            dispatch({ type: "changeScreen", screen });
            setIsLoading(false);
        });
    };
    const isCurrentStation = station.key === currentStation;
    const isInRange = station.hours <= turnsLeft;
    const isClosed = stationKey === StationKey.bellGardens && turnsLeft > 20;
    const canTravel = !isCurrentStation && !isClosed && isInRange;
    const prompt = getStationPrompt(isCurrentStation, canTravel);
    return (
        <li
            css={{
                inlineSize: "100%",
                display: "flex",
                flex: 1,
                borderColor: "transparent",
            }}
        >
            <button
                css={{
                    inlineSize: "100%",
                    blockSize: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    backgroundColor: "transparent",
                    paddingBlock: 0,
                    paddingInline: "20x",
                    border: "none",
                }}
                disabled={!canTravel}
                onClick={handleTravel}
            >
                <h4
                    css={{
                        marginBlock: 0,
                        color: canTravel
                            ? Colors.Text.base
                            : Colors.Text.disable,
                        fontSize: "20px",
                        fontVariantCaps: "small-caps",
                        letterSpacing: "4px",
                        wordSpacing: "8px",
                        animation: isCurrentStation
                            ? `${Animations.blink} 1s linear infinite`
                            : "",
                    }}
                >
                    <span
                        css={{
                            color:
                                canTravel || isCurrentStation
                                    ? "inherit"
                                    : Colors.Text.inverse,
                        }}
                    >
                        {prompt}
                    </span>{" "}
                    {station.name}
                </h4>
                {canTravel && (
                    <h4 css={{ marginInlineStart: "auto" }}>
                        ({station.hours} hours)
                    </h4>
                )}
                {isClosed && (
                    <h4
                        css={{
                            marginInlineStart: "auto",
                            color: Colors.Text.disable,
                        }}
                    >
                        (Closed)
                    </h4>
                )}
            </button>
        </li>
    );
};

function getStationPrompt(isCurrentStation: boolean, canTravel: boolean) {
    if (isCurrentStation) return "*";
    if (!canTravel) return "_";
    return ">";
}
