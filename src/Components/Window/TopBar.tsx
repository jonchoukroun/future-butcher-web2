/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import * as React from "react";

import * as Colors from "../../Styles/colors";

interface TopBarProps {
    title: string;
}

const TopBarButtonStyles = css({
    inlineSize: "30px",
    marginBlockStart: "2px",
    marginBlockEnd: "3px",
    marginInlineEnd: "3px",
    paddingBlock: 0,
    paddingInline: "5px",
    backgroundColor: Colors.Background.body,
    borderWidth: "2px",
    borderStyle: "outset",
    borderRadius: "2px",
    borderBlockStartColor: Colors.Border.light,
    borderInlineStartColor: Colors.Border.light,
    borderBlockEndColor: Colors.Border.dark,
    borderInlineEndColor: Colors.Border.dark,
});

export const TopBar = ({ title }: TopBarProps) => {
    return (
        <div
            css={css({
                inlineSize: "100%",
                display: "flex",
                backgroundColor: Colors.Background.accent,
                borderWidth: "2px",
                borderStyle: "inset",
                borderRadius: "2px",
                borderBlockStartColor: Colors.Border.dark,
                borderInlineStartColor: Colors.Border.dark,
                borderBlockEndColor: Colors.Border.light,
                borderInlineEndColor: Colors.Border.light,
            })}
        >
            <h2
                css={css({
                    marginBlock: 0,
                    marginInlineStart: "5px",
                    color: Colors.Text.headingLight,
                })}
            >
                {title}
            </h2>
            <div
                css={css({
                    display: "flex",
                    marginInlineStart: "auto",
                })}
            >
                <button css={TopBarButtonStyles}>?</button>
                <button css={TopBarButtonStyles}>X</button>
            </div>
        </div>
    );
};
