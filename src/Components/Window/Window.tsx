/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ReactNode } from "react";

import { TopBar } from "./TopBar";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

interface WindowProps {
    title: string;
    children: ReactNode;
}

export const Window = ({ title, children }: WindowProps) => {
    const windowSize = useWindowSize();
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
                    blockSize: windowSize.block,
                    maxBlockSize: "812px",
                    inlineSize: windowSize.inline,
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
                    borderBlockStartColor: Colors.Border.light,
                    borderInlineStartColor: Colors.Border.light,
                    borderBlockEndColor: Colors.Border.dark,
                    borderInlineEndColor: Colors.Border.dark,
                })}
            >
                <TopBar title={title} />
                {children}
            </div>
        </div>
    );
};
