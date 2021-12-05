/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Stations } from "./Stations";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Subway = () => {
    const { heightAdjustment, layout } = useWindowSize();

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
                <small css={{ color: Colors.Text.secondary }}>
                    Travel to another neighborhood.
                </small>
            </div>
            <div
                css={{
                    inlineSize: "95%",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingBlock: layout === "full" ? "10px" : "4px",
                }}
            >
                <button
                    css={{
                        padding: "4px",
                        backgroundColor: Colors.Background.subtle,
                        borderColor: "transparent",
                        borderRadius: "7px",
                        borderWidth: "1px",
                        color: "black",
                        fontSize: "16px",
                        "&:active": {
                            backgroundColor: "transparent",
                            borderColor: Colors.Border.subtle,
                            color: Colors.Text.primary,
                        },
                    }}
                >
                    Toggle Details
                </button>
            </div>
            <Stations />
        </div>
    );
};
