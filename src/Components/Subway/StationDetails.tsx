/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { subwayStations, StationKey } from "../../Fixtures/subwayStations";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { useChannel, Callback } from "../../PhoenixChannel/ChannelProvider";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";
import { formatMoney } from "../Utils/formatMoney";

interface StationDetailsProps {
    stationKey: StationKey;
    onDeselectStation: () => void;
}

export const StationDetails = ({
    stationKey,
    onDeselectStation,
}: StationDetailsProps) => {
    const station = subwayStations.find(({ key }) => key === stationKey);
    if (station === undefined) throw new Error("Could not find station");

    const { handlePushCallback } = useChannel();
    const {
        dispatch,
        state: { turnsLeft },
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("Turns left is not defined");

    const isStationOpen =
        stationKey !== StationKey.bellGardens || turnsLeft <= 20;

    const [isLoading, setIsLoading] = useState(false);
    const handleTravel = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const stateData = await handlePushCallback(Callback.travel, {
            station: stationKey,
        });

        if (stateData === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        const screen =
            stateData.rules.state === "mugging" ? Screen.Mugging : Screen.Main;
        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData });
            dispatch({ type: "changeScreen", screen });
            setIsLoading(false);
        });
    };

    const { layout } = useWindowSize();

    return (
        <div css={{ display: "flex", flexDirection: "column" }}>
            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    marginBlockEnd: "10px",
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <h2 css={{ marginBlock: 0, fontVariantCaps: "small-caps" }}>
                    {station.name}
                </h2>
                <small
                    css={{
                        marginBlock: "4px",
                        color: Colors.Text.subtle,
                        fontStyle: "italic",
                    }}
                >
                    {station.stationDescription}
                </small>
            </div>

            {isStationOpen ? (
                <p css={{ marginBlockStart: "4px" }}>
                    Travel to {station.name}?
                </p>
            ) : (
                <p css={{ marginBlockStart: "4px" }}>Opens at 9:00am</p>
            )}

            <div
                css={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginBlockEnd: "10px",
                }}
            >
                <ButtonPrimary
                    type={"Block"}
                    label={"Back"}
                    border={"Thin"}
                    isDisabled={isLoading}
                    clickCB={onDeselectStation}
                />
                <div css={{ marginInline: "4px" }}> </div>
                <ButtonPrimary
                    type={"Block"}
                    label={"Go"}
                    border={"Thin"}
                    scheme={"Inverse"}
                    isLoading={isLoading}
                    isDisabled={!isStationOpen}
                    clickCB={handleTravel}
                />
            </div>

            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    "& p": {
                        marginBlockEnd: layout === "full" ? "2px" : 0,
                    },
                    "& small": {
                        color: Colors.Text.subtle,
                        fontStyle: "italic",
                        marginBlockEnd: layout === "full" ? "10px" : "4px",
                    },
                }}
            >
                <p>POI: {station.uniqueBuilding}</p>

                <p>Travel Cost: {formatMoney(station.gangTax)}</p>
                <small>Travel will take 1 hour</small>

                <p>Dominant Gang: {station.gangName}</p>
                <small>{station.gangDescription}</small>

                <p>Reputation: Safe</p>
                <small>
                    The local gang will let you visit wihtout trouble.
                </small>
            </div>
        </div>
    );
};
