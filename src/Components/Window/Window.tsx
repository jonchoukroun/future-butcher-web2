/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import * as React from "react";

import { TopBar } from "./TopBar";
import * as Colors from "../../Styles/colors";

interface WindowProps {
    title: string;
}

export const Window = ({ title }: WindowProps) => {
    const [viewportSize, setViewportSize] = React.useState<{
        blockSize: number;
        inlineSize: number;
    }>({
        blockSize: window.innerHeight - 10,
        inlineSize: window.innerWidth - 10,
    });

    function resizeHandler() {
        setViewportSize({
            blockSize: window.innerHeight - 10,
            inlineSize: window.innerWidth - 10,
        });
    }

    React.useEffect(() => {
        window.onresize = resizeHandler;

        return () => {
            window.onresize = null;
        };
    }, []);
    return (
        <div
            className="container"
            css={css({
                blockSize: window.innerHeight,
                inlineSize: window.innerWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            })}
        >
            <div
                className="outer-window"
                css={css({
                    blockSize: viewportSize.blockSize,
                    maxBlockSize: "812px",
                    inlineSize: viewportSize.inlineSize,
                    maxInlineSize: "990px",
                    paddingBlock: "1px",
                    paddingInlineStart: "1px",
                    paddingInlineEnd: "4px",
                    backgroundColor: Colors.Background.body,
                    borderBlockStartWidth: "2px",
                    borderBlockEndWidth: "3px",
                    borderInlineStartWidth: "2px",
                    borderInlineEndWidth: "3px",
                    borderStyle: "outset",
                    borderRadius: "2px",
                    borderColor: "#c3c3c3",
                })}
            >
                <TopBar title={title} />
            </div>
        </div>
    );
};
