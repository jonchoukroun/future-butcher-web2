/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";

export const Welcome = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize } = getContentSize();

    const date = new Date();
    date.setFullYear(2055, date.getMonth(), date.getDate());
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const displayDate = date.toLocaleDateString("en-US", options);

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlock: "20px",
                }}
            >
                <h2
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        fontVariantCaps: "small-caps",
                    }}
                >
                    Los Angeles
                </h2>
                <h4 css={{ marginBlock: 0, fontFamily: "Share Tech Mono" }}>
                    {displayDate}
                </h4>
            </div>

            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <p>The economy is ruins after the collapse of HypeCoin.</p>
            </div>
        </div>
    );
};
