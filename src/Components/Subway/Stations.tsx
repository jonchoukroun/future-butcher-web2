/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { useGameState } from "../GameState/GameStateProvider";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { subwayStations } from "../../Fixtures/subwayStations";

export const Stations = () => {
    const { currentStation } = useGameState();
    const currentStationIndex = subwayStations.findIndex(
        ({ key }) => key == currentStation,
    );

    const { getContentSize } = useWindowSize();
    const { blockSize } = getContentSize();
    const stationsCount = subwayStations.length;
    const listItemBlockSize =
        Math.round((blockSize - 24) / stationsCount) - (stationsCount + 6);

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
                    blockSize={listItemBlockSize}
                    isLast={idx === stationsCount - 1}
                    isAboveCurrentStation={idx === currentStationIndex - 1}
                />
            ))}
        </ul>
    );
};
