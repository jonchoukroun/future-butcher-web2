/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../Styles/colors";

export const enum ButtonSize {
    Set = "set",
    Full = "full",
}
type ButtonSizeType = `${ButtonSize}`;

export const enum ButtonScheme {
    Base = "base",
    Inverse = "inverse",
    Danger = "danger",
    Hidden = "hidden",
}
type ButtonSchemeType = `${ButtonScheme}`;

export interface ButtonProps {
    label: string;
    size?: ButtonSizeType;
    scheme?: ButtonSchemeType;
    disabled?: boolean;
    clickCB: () => void;
}

export const Button = ({
    label,
    size = ButtonSize.Set,
    scheme = ButtonScheme.Base,
    disabled = false,
    clickCB,
}: ButtonProps) => {
    const buttonLayout = buildButtonLayout(size);

    const {
        backgroundColor,
        backgroundColorActive,
        borderColor,
        fontColor,
        fontColorActive,
    } = getColorScheme(scheme, disabled);

    return (
        <button
            css={css(buttonLayout, {
                backgroundColor,
                borderColor,
                borderStyle: "solid",
                borderBottomWidth: "2px",
                color: fontColor,
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

function getColorScheme(
    scheme: ButtonSchemeType,
    disabled: boolean,
): {
    backgroundColor: string;
    backgroundColorActive: string;
    borderColor: string;
    fontColor: string;
    fontColorActive: string;
} {
    if (disabled && scheme !== ButtonScheme.Hidden) {
        return {
            backgroundColor: Colors.Background.base,
            backgroundColorActive: Colors.Background.base,
            borderColor: Colors.Border.subtle,
            fontColor: Colors.Text.disable,
            fontColorActive: Colors.Text.disable,
        };
    }

    switch (scheme) {
        case ButtonScheme.Base:
            return {
                backgroundColor: Colors.Background.base,
                backgroundColorActive: Colors.Background.inverse,
                borderColor: Colors.Border.base,
                fontColor: Colors.Text.base,
                fontColorActive: Colors.Text.inverse,
            };
        case ButtonScheme.Inverse:
            return {
                backgroundColor: Colors.Background.inverse,
                backgroundColorActive: Colors.Background.base,
                borderColor: Colors.Border.base,
                fontColor: Colors.Text.inverse,
                fontColorActive: Colors.Text.base,
            };
        case ButtonScheme.Hidden:
            return {
                backgroundColor: Colors.Background.base,
                backgroundColorActive: Colors.Background.base,
                borderColor: "transparent",
                fontColor: Colors.Text.inverse,
                fontColorActive: Colors.Text.inverse,
            };
        case ButtonScheme.Danger:
            return {
                backgroundColor: Colors.Background.base,
                backgroundColorActive: Colors.Background.danger,
                borderColor: Colors.Border.danger,
                fontColor: Colors.Text.danger,
                fontColorActive: Colors.Text.inverse,
            };
        default:
            throw new Error(`Invalid Button scheme type ${scheme}`);
    }
}
