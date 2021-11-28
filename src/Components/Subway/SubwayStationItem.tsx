/** @jsx jsx */
import { jsx } from "@emotion/react";

import { FullButton } from "../Form/FullButton";
import { Station } from "../../Fixtures/subwayStations";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    station: Station;
    isCurrentStation: boolean;
    blockSize: number;
    isLast: boolean;
}

export const SubwayStationItem = ({
    station,
    isCurrentStation,
    blockSize,
    isLast,
}: SubwayStationItemProps) => {
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
        paddingInlineStart: "7px",
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
        borderBlockEndColor: isLast ? "transparent" : Colors.Border.light,
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
                            <strong>Gang Tax:</strong> ${station.gangTax}
                        </span>
                    )}
                </p>
                {!isCurrentStation && (
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "end",
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
