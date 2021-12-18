/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { subwayStations, StationKey } from "../../Fixtures/subwayStations";
import * as Colors from "../../Styles/colors";

export const Stations = ({
    handleSelectStation,
}: {
    handleSelectStation: (station: StationKey) => void;
}) => {
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
            <small
                css={{
                    color: Colors.Text.secondary,
                    textAlign: "center",
                }}
            >
                Select a neighborhood for details.
            </small>
            {subwayStations.map(({ key }, idx) => (
                <SubwayStationItem
                    key={`${key}-${idx}`}
                    stationKey={key}
                    onSelectStation={handleSelectStation}
                />
            ))}
        </ul>
    );
};
