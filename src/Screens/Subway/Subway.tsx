/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Stations } from "./Stations";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
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
                            color: Colors.Text.base,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            wordSpacing: "4px",
                        }}
                    >
                        Subway
                    </h2>
                )}
            </div>
            <Stations />
        </div>
    );
};
