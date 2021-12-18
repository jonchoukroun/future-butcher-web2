/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";

export const ErrorScreen = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlock: "20px",
                }}
            >
                <h2
                    css={{
                        marginBlockEnd: "20px",
                        fontVariantCaps: "small-caps",
                        textAlign: "center",
                    }}
                >
                    Los Angeles is under lockdown.
                </h2>
                <p>
                    A new Norwegian virus is burning across the globe. The
                    economy is at a standstill while people shelter in place.
                </p>
                <p>Come back soon.</p>
            </div>
        </div>
    );
};
