/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

import { StationDetails } from "./StationDetails";
import { Stations } from "./Stations";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { StationKey } from "../../Fixtures/subwayStations";
import * as Colors from "../../Styles/colors";

export const Subway = () => {
    const { heightAdjustment, layout } = useWindowSize();

    const [selectedStation, setSelectedStation] = useState<
        StationKey | undefined
    >(StationKey.bellGardens);
    const handleSelectStation = (station: StationKey | undefined) => {
        setSelectedStation(station);
    };

    return (
        <div
            css={{
                blockSize: `calc(100% - ${heightAdjustment}px)`,
                maxBlockSize: "600px",
                display: "flex",
                flexDirection: "column",
                paddingInline: "8px",
            }}
        >
            <div
                css={{
                    marginBlockStart: "5px",
                    marginBlockEnd: layout === "full" ? "20px" : "5px",
                    textAlign: "center",
                }}
            >
                {layout === "full" && (
                    <h2
                        css={{
                            marginBlock: 0,
                            color: Colors.Text.heading,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            wordSpacing: "4px",
                        }}
                    >
                        Subway
                    </h2>
                )}
            </div>
            {selectedStation ? (
                <StationDetails
                    stationKey={selectedStation}
                    onDeselectStation={() => handleSelectStation(undefined)}
                />
            ) : (
                <Stations handleSelectStation={handleSelectStation} />
            )}
        </div>
    );
};
