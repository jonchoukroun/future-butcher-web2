/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const SurplusStore = () => {
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
            {layout === "full" && (
                <h2
                    css={{
                        marginBlock: 0,
                        color: Colors.Text.base,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        wordSpacing: "4px",
                    }}
                >
                    Gus&apos; Army Surplus
                </h2>
            )}
        </div>
    );
};
