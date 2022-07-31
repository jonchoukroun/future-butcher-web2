/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../Styles/colors";

export const enum ButtonSize {
    Set,
    Full,
}

type ButtonSizeType = typeof ButtonSize[keyof typeof ButtonSize];

export interface ButtonProps {
    label: string;
    size?: ButtonSizeType;
    hidden?: boolean;
    inverse?: boolean;
    disabled?: boolean;
    clickCB: () => void;
}

export const Button = ({
    label,
    size = ButtonSize.Set,
    hidden,
    inverse = false,
    disabled = false,
    clickCB,
}: ButtonProps) => {
    const buttonLayout = buildButtonLayout(size);

    const {
        backgroundColor,
        backgroundColorActive,
        fontColor,
        fontColorActive,
    } = getColorScheme(inverse, disabled);

    return (
        <button
            css={css(buttonLayout, {
                backgroundColor: hidden
                    ? Colors.Background.base
                    : backgroundColor,
                borderColor: hidden
                    ? "transparent"
                    : disabled
                    ? Colors.Border.subtle
                    : Colors.Border.base,
                borderStyle: "solid",
                borderBottomWidth: "2px",
                color: hidden ? Colors.Text.inverse : fontColor,
                "&:active": {
                    backgroundColor: backgroundColorActive,
                    color: fontColorActive,
                },
            })}
            onClick={clickCB}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

function buildButtonLayout(size: ButtonSizeType) {
    return css({
        inlineSize: size === ButtonSize.Set ? "140px" : "100%",
        margin: 0,
        paddingBlock: "5px",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "18px",
        fontWeight: 700,
        textTransform: "uppercase",
    });
}

function getColorScheme(inverse: boolean, disabled: boolean) {
    return {
        backgroundColor: inverse
            ? Colors.Background.inverse
            : Colors.Background.base,
        backgroundColorActive: inverse
            ? Colors.Background.base
            : Colors.Background.inverse,
        fontColor: disabled
            ? Colors.Text.disable
            : inverse
            ? Colors.Text.inverse
            : Colors.Text.base,
        fontColorActive: inverse ? Colors.Text.base : Colors.Text.inverse,
    };
}
