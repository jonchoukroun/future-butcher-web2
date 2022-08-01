/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { StationDetails } from "../../Fixtures/subwayStations";
import { StationType } from "../../GameData";

import * as Colors from "../../Styles/colors";

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
            <small
                css={{
                    color: Colors.Text.subtle,
                    textAlign: "center",
                }}
            >
                Select an open neighborhood to travel there.
            </small>
            {Object.keys(StationDetails).map((key, idx) => (
                <SubwayStationItem
                    key={`${key}-${idx}`}
                    stationKey={key as StationType}
                />
            ))}
        </ul>
    );
};
