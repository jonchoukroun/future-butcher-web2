/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { Station } from "../../Fixtures/subwayStations";

interface SubwayStationItemProps {
    station: Station;
    isCurrentStation: boolean;
}

export const SubwayStationItem = ({
    station,
    isCurrentStation,
}: SubwayStationItemProps) => {
    const { windowSize } = useWindowSize();
    return (
        <li>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {windowSize.blockSize >= 667 ? (
                    <div
                        css={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <h3
                            css={{
                                margin: 0,
                            }}
                        >
                            {station.name}
                        </h3>
                        <p
                            css={{
                                margin: 0,
                            }}
                        >
                            {isCurrentStation ? (
                                <em>Current location.</em>
                            ) : (
                                <span>
                                    <strong>Gang Tax:</strong> $
                                    {station.gangTax}
                                </span>
                            )}
                        </p>
                    </div>
                ) : (
                    <div
                        css={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <h4
                            css={{
                                margin: 0,
                            }}
                        >
                            {station.name}
                        </h4>
                        <small
                            css={{
                                margin: 0,
                            }}
                        >
                            {isCurrentStation ? (
                                <em>Current location.</em>
                            ) : (
                                <span>
                                    <strong>Gang Tax:</strong> $
                                    {station.gangTax}
                                </span>
                            )}
                        </small>
                    </div>
                )}
                {!isCurrentStation && (
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <ButtonPrimary
                            label={"Go"}
                            type={"Half"}
                            clickCB={() => {
                                return;
                            }}
                        />
                    </div>
                )}
            </div>
        </li>
    );
};
