/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

import { Prompt } from "../../Components";
import { StationDetails } from "../../Fixtures/subwayStations";
import { Screen, StationType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError, ScreenType } from "../../GameData/State";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    stationKey: StationType;
}

export const SubwayStationItem = ({ stationKey }: SubwayStationItemProps) => {
    const {
        dispatch,
        state: { currentStation, turnsLeft },
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("State is undefined");

    const { handlePushCallback } = useChannel();

    const station = StationDetails[stationKey];
    if (station === undefined) throw new Error("Cannot find station");

    const [isLoading, setIsLoading] = useState(false);
    const handleTravel = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const stateData = await handlePushCallback("travel", {
            destination: stationKey,
        });

        // TODO: API error handling
        if (stateData === undefined || isApiError(stateData)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        let screen: ScreenType;
        if (stateData.rules.state === "mugging") {
            screen = Screen.Mugging;
        } else if (stateData.station.station_name === "bell_gardens") {
            screen = Screen.Store;
        } else {
            screen = Screen.Market;
        }
        dispatch({ type: "updateStateData", stateData });
        dispatch({ type: "changeScreen", screen });
        setIsLoading(false);
    };
    const isCurrentStation = stationKey === currentStation;
    const isInRange = station.hours <= turnsLeft;
    const isClosed =
        stationKey === "bell_gardens" && (turnsLeft > 20 || turnsLeft <= 2);
    const canTravel = !isCurrentStation && !isClosed && isInRange;

    const prompt = getStationPrompt(isCurrentStation, canTravel);

    const backgroundColor = isCurrentStation
        ? Colors.Background.subtle
        : "transparent";
    const color = isCurrentStation
        ? Colors.Text.inverse
        : canTravel
        ? Colors.Text.base
        : Colors.Text.disable;
    return (
        <li
            css={{
                inlineSize: "100%",
                display: "flex",
                flex: 1,
                paddingBlock: "20px",
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
                    backgroundColor,
                    paddingInline: "20x",
                    border: 0,
                    animation: isCurrentStation
                        ? `${Animations.backgroundBlink} 1s linear infinite`
                        : 0,
                }}
                disabled={!canTravel}
                onClick={handleTravel}
            >
                <Prompt symbol={prompt} color={color} hidden={!canTravel} />

                <h2
                    css={{
                        marginBlock: 0,
                        fontSize: "24px",
                        color,
                    }}
                >
                    {station.displayName}
                </h2>

                <div css={{ marginInlineStart: "auto" }}>
                    {canTravel && (
                        <h4
                            css={{
                                marginBlock: 0,
                                fontSize: "18px",
                            }}
                        >
                            {station.hours} hours
                        </h4>
                    )}

                    {isClosed && (
                        <h4
                            css={{
                                marginBlock: 0,
                                fontSize: "18px",
                                color: Colors.Text.disable,
                            }}
                        >
                            Closed
                        </h4>
                    )}
                </div>
            </button>
        </li>
    );
};

function getStationPrompt(isCurrentStation: boolean, canTravel: boolean) {
    if (isCurrentStation) return "*";
    if (!canTravel) return "_";
    return ">";
}
