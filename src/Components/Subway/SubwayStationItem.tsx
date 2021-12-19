/** @jsx jsx */
import { jsx } from "@emotion/react";

import { StationKey, subwayStations } from "../../Fixtures/subwayStations";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    stationKey: StationKey;
    onSelectStation: (stationKey: StationKey) => void;
}

export const SubwayStationItem = ({
    stationKey,
    onSelectStation,
}: SubwayStationItemProps) => {
    const {
        state: { currentStation },
    } = useGameState();

    const station = subwayStations.find(({ key }) => key === stationKey);
    if (station === undefined) throw new Error("Cannot find station");

    const isCurrentStation = station.key === currentStation;

    return (
        <li
            css={{
                inlineSize: "100%",
                display: "flex",
                flex: 1,
                borderColor: "transparent",
                borderBlockEndColor: Colors.Border.subtle,
                borderStyle: "solid",
                borderWidth: "1px",
            }}
        >
            <button
                css={{
                    inlineSize: "100%",
                    blockSize: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    paddingBlock: 0,
                    paddingInline: "20x",
                    border: "none",
                }}
                disabled={isCurrentStation}
                onClick={() => onSelectStation(stationKey)}
            >
                <h4
                    css={{
                        marginBlock: 0,
                        color: isCurrentStation
                            ? Colors.Text.subtle
                            : Colors.Text.base,
                        fontSize: "20px",
                        fontStyle: isCurrentStation ? "italic" : "normal",
                        fontVariantCaps: "small-caps",
                    }}
                >
                    {station.name}
                </h4>
            </button>
        </li>
    );
};
