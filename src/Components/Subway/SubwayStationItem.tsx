/** @jsx jsx */
import { jsx } from "@emotion/react";

import { FullButton } from "../Form/FullButton";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { Station } from "../../Fixtures/subwayStations";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    station: Station;
    isCurrentStation: boolean;
    blockSize: number;
    isLast: boolean;
    isAboveCurrentStation: boolean;
}

export const SubwayStationItem = ({
    station,
    isCurrentStation,
    blockSize,
    isLast,
    isAboveCurrentStation,
}: SubwayStationItemProps) => {
    const { windowSize } = useWindowSize();
    const baseStationItemStyle = {
        blockSize: `${blockSize}px`,
        display: "flex",
        marginBlock: "1px",
        paddingBlock: "2px",
        paddingInline: "6px",
        borderRadius: "2px",
    };

    const currentStationItemStyle = {
        ...baseStationItemStyle,
        marginInline: "-1px",
        // paddingInlineStart: "6px",
        backgroundColor: Colors.Background.dark,
        borderWidth: "2px",
        borderStyle: "inset",
        borderBlockStartColor: Colors.Border.dark,
        borderInlineStartColor: Colors.Border.dark,
        borderBlockEndColor: isLast ? "transparent" : Colors.Border.light,
        borderInlineEndColor: Colors.Border.light,
        "h3, p": {
            color: Colors.Text.bodyLight,
        },
    };

    const otherStationItemStyle = {
        ...baseStationItemStyle,
        backgroundColor: Colors.Background.body,
        borderWidth: "2px",
        borderStyle: "groove",
        borderColor: "transparent",
        borderBlockEndColor:
            isLast || isAboveCurrentStation
                ? "transparent"
                : Colors.Border.light,
    };

    return (
        <li
            css={
                isCurrentStation
                    ? currentStationItemStyle
                    : otherStationItemStyle
            }
        >
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
                        <FullButton
                            label={"Go"}
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
