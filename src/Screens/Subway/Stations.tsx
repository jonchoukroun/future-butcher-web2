/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SubwayStationItem } from "./SubwayStationItem";
import { subwayStations } from "../../Fixtures/subwayStations";
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
            {subwayStations.map(({ key }, idx) => (
                <SubwayStationItem key={`${key}-${idx}`} stationKey={key} />
            ))}
        </ul>
    );
};
