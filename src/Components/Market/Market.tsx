/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutList } from "./CutList";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Market = () => {
    const { layout } = useWindowSize();
    const heightAdjustment = layout === "full" ? 70 : 70 + 40;
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
                        }}
                    >
                        Cuts Market
                    </h2>
                )}
                <small css={{ color: Colors.Text.secondary }}>
                    Buy low, sell high.
                </small>
            </div>
            <CutList />
        </div>
    );
};
