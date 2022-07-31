/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import * as Colors from "../Styles/colors";

export const enum ButtonSize {
    Full = "full",
    Set = "set",
    Small = "small",
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
    loading?: boolean;
    clickCB: () => void;
}

export const Button = ({
    label,
    size = ButtonSize.Set,
    scheme = ButtonScheme.Base,
    disabled = false,
    loading = false,
    clickCB,
}: ButtonProps) => {
    const [loadingLabel, setLoadingLabel] = useState("Loading");
    useEffect(() => {
        if (!loading) return;

        const interval = setInterval(() => {
            setLoadingLabel((str) => {
                return str.length > 20 ? "." : str + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, [loading]);

    const {
        backgroundColor,
        backgroundColorActive,
        borderColor,
        fontColor,
        fontColorActive,
    } = getColorScheme(scheme, disabled);

    const buttonLayout = buildButtonLayout(size);

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
                textAlign: loading && ButtonSize.Full ? "start" : "center",
                overflowX: "hidden",
            })}
            onClick={clickCB}
            disabled={disabled}
        >
            {loading ? loadingLabel : label}
        </button>
    );
};

function buildButtonLayout(size: ButtonSizeType) {
    return css({
        blockSize: size === ButtonSize.Small ? "28px" : "auto",
        inlineSize:
            size === ButtonSize.Set
                ? "140px"
                : ButtonSize.Small
                ? "20x"
                : "100%",
        margin: 0,
        paddingBlock: size === ButtonSize.Small ? 0 : "5px",
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
                borderColor: "transparent",
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
