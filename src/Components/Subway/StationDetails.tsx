/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { subwayStations, StationKey } from "../../Fixtures/subwayStations";
// import { useGameState } from "../../GameData/GameStateProvider";
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

    // const { dispatch } = useGameState();
    const handleTravel = () => {
        console.log("!!travel to:", stationKey);
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
                        color: Colors.Text.secondary,
                        fontStyle: "italic",
                    }}
                >
                    {station.stationDescription}
                </small>
            </div>

            <p css={{ marginBlockStart: "4px" }}>Travel to {station.name}?</p>

            <div
                css={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginBlockEnd: "10px",
                }}
            >
                <ButtonPrimary
                    type={"Stretch"}
                    label={"Back"}
                    border={"Thin"}
                    clickCB={onDeselectStation}
                />
                <div css={{ marginInline: "4px" }}> </div>
                <ButtonPrimary
                    type={"Stretch"}
                    label={"Go"}
                    border={"Thin"}
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
                        color: Colors.Text.secondary,
                        fontStyle: "italic",
                        marginBlockEnd: layout === "full" ? "10px" : "4px",
                    },
                }}
            >
                <p>Unique Building: {station.uniqueBuilding}</p>

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
