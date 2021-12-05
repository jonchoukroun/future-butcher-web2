/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { subwayStations } from "../../Fixtures/subwayStations";

export const Stations = () => {
    return (
        <ul
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
                margin: 0,
                padding: 0,
                listStyleType: "none",
            }}
        >
            {subwayStations.map((station, idx) => (
                <SubwayStationItem
                    key={`${station.key}-${idx}`}
                    station={station}
                />
            ))}
        </ul>
    );
};
