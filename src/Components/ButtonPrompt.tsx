/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";

export const enum ButtonPromptSize {
    Compact,
    Full,
}
type ButtonPromptSizeType = typeof ButtonPromptSize[keyof typeof ButtonPromptSize];

interface ButtonPromptProps {
    label: string;
    size: ButtonPromptSizeType;
    blink?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    loading?: boolean;
    clickCB: () => void;
}

export function ButtonPrompt({
    label,
    size,
    blink,
    disabled,
    hidden,
    loading,
    clickCB,
}: ButtonPromptProps) {
    const stylesForSize = getStyleForSize(size);

    const backgroundColor = Colors.Background.base;
    const backgroundColorActive = Colors.Background.inverse;
    const color = disabled ? Colors.Text.disable : Colors.Text.base;
    const colorActive = Colors.Text.inverse;

    return (
        <button
            css={css(stylesForSize, {
                backgroundColor,
                color,
                border: 0,
                opacity: hidden ? 0 : 1,
                "&:active": {
                    backgroundColor: backgroundColorActive,
                    color: colorActive,
                },
            })}
            disabled={disabled || hidden}
            onClick={clickCB}
        >
            <Prompt blink={blink} />

            {loading ? "..." : label}
        </button>
    );
}

function getStyleForSize(size: ButtonPromptSize) {
    const baseButtonStyles = css({
        margin: 0,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "20px",
        fontWeight: 700,
        lineHeight: "26px",
        textTransform: "uppercase",
    });

    switch (size) {
        case ButtonPromptSize.Compact:
            return css(
                {
                    blockSize: "auto",
                    inlineSize: "auto",
                    paddingBlock: "5px",
                },
                baseButtonStyles,
            );

        case ButtonPromptSize.Full:
            return css(
                {
                    blockSize: "46px",
                    inlineSize: "100%",
                    padding: 0,
                    textAlign: "start",
                },
                baseButtonStyles,
            );

        default:
            return baseButtonStyles;
    }
}
