/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";
import { useEffect, useState } from "react";

export const enum ButtonPromptSize {
    Compact,
    Full,
    Small,
}
type ButtonPromptSizeType =
    typeof ButtonPromptSize[keyof typeof ButtonPromptSize];

interface ButtonPromptProps {
    label: string;
    size: ButtonPromptSizeType;
    inverse?: boolean;
    showPrompt?: boolean;
    blink?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    danger?: boolean;
    loading?: boolean;
    clickCB: () => void;
}

export function ButtonPrompt({
    label,
    size,
    inverse = false,
    showPrompt = true,
    blink = true,
    disabled = false,
    hidden = false,
    danger = false,
    loading = false,
    clickCB,
}: ButtonPromptProps) {
    const stylesForSize = getStyleForSize(size);

    const {
        backgroundColor,
        backgroundColorActive,
        fontColor,
        fontColorActive,
    } = getColorScheme({ danger, disabled, inverse });

    const [loadingLabel, setLoadingLabel] = useState("Loading");
    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setLoadingLabel((str) => {
                return str.length > 24 ? "Loading" : str + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <button
            css={css(stylesForSize, {
                display: "flex",
                alignItems: "center",
                paddingInlineStart: inverse ? "10px" : 0,
                backgroundColor,
                color: fontColor,
                border: 0,
                opacity: hidden ? 0 : 1,
                "&:active": {
                    backgroundColor: backgroundColorActive,
                    color: fontColorActive,
                    "& > .prompt-symbol": {
                        color: fontColorActive,
                    },
                },
            })}
            disabled={disabled || hidden}
            onClick={clickCB}
        >
            <Prompt color={fontColor} blink={blink} hidden={!showPrompt} />

            {loading ? loadingLabel : label}
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

        case ButtonPromptSize.Small:
            return css(
                {
                    blockSize: "auto",
                    inlineSize: "auto",
                    paddingBlock: "5px",
                    fontSize: "16px",
                },
                baseButtonStyles,
            );

        default:
            return baseButtonStyles;
    }
}

function getColorScheme({
    danger,
    disabled,
    inverse,
}: {
    danger: boolean;
    disabled: boolean;
    inverse: boolean;
}): {
    backgroundColor: string;
    backgroundColorActive: string;
    fontColor: string;
    fontColorActive: string;
} {
    if (disabled) {
        return {
            backgroundColor: Colors.Background.base,
            backgroundColorActive: Colors.Background.base,
            fontColor: Colors.Text.disable,
            fontColorActive: Colors.Text.disable,
        };
    }

    if (inverse) {
        return {
            backgroundColor: Colors.Background.inverse,
            backgroundColorActive: Colors.Background.base,
            fontColor: Colors.Text.inverse,
            fontColorActive: Colors.Text.base,
        };
    } else if (danger) {
        return {
            backgroundColor: Colors.Background.base,
            backgroundColorActive: Colors.Background.danger,
            fontColor: Colors.Text.danger,
            fontColorActive: Colors.Text.inverse,
        };
    } else {
        return {
            backgroundColor: Colors.Background.base,
            backgroundColorActive: Colors.Background.inverse,
            fontColor: Colors.Text.base,
            fontColorActive: Colors.Text.inverse,
        };
    }
}
