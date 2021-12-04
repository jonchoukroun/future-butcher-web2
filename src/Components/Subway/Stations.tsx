/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { useGameState } from "../GameState/GameStateProvider";
import { subwayStations } from "../../Fixtures/subwayStations";

export const Stations = () => {
    const { currentStation } = useGameState();

    return (
        <ul
            css={{
                inlineSize: "100%",
                margin: 0,
                padding: 0,
                listStyleType: "none",
            }}
        >
            {subwayStations.map((station, idx) => (
                <SubwayStationItem
                    key={`${station.key}-${idx}`}
                    station={station}
                    isCurrentStation={station.key === currentStation}
                />
            ))}
        </ul>
    );
};
