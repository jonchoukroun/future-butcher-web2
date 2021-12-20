/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../../Styles/colors";

type ButtonType = "Full" | "Half" | "Sized" | "Block";
type BorderType = "Full" | "Thin" | "None";
type SchemeType = "Normal" | "Inverse";

interface ButtonPrimaryProps {
    type: ButtonType;
    label: string;
    scheme?: SchemeType;
    isDisabled?: boolean;
    isDanger?: boolean;
    border?: BorderType;
    clickCB: () => void;
}

export const ButtonPrimary = ({
    type,
    label,
    scheme = "Normal",
    isDisabled = false,
    isDanger = false,
    border = "Full",
    clickCB,
}: ButtonPrimaryProps) => {
    const buttonTypeStyles = getButtonTypeStyles(type);
    const {
        backgroundColor,
        backgroundColorActive,
        borderColor,
        fontColor,
        fontColorActive,
    } = getColorScheme(isDisabled, isDanger, scheme);

    return (
        <button
            css={css(buttonTypeStyles, {
                backgroundColor,
                borderColor,
                borderRadius: "2px",
                borderStyle: border === "None" ? "none" : "outset",
                borderWidth: border === "Full" ? "2px" : "1px",
                boxShadow:
                    border === "None" || isDisabled
                        ? "none"
                        : "2px 2px 8px 2px rgba(0, 0, 0, 0.4)",
                color: fontColor,
                "&:active": {
                    backgroundColor: backgroundColorActive,
                    color: fontColorActive,
                },
                fontStyle: isDisabled ? "italic" : "normal",
            })}
            onClick={clickCB}
            disabled={isDisabled}
        >
            {label}
        </button>
    );
};

function getButtonTypeStyles(type: ButtonType) {
    const baseButtonTypeStyles = css({
        margin: 0,
        borderRadius: "2px",
        fontFamily: "Share Tech Mono, monospace",
        lineHeight: "26px",
        textTransform: "uppercase",
    });

    switch (type) {
        case "Full":
            return css(
                {
                    blockSize: "36px",
                    inlineSize: "140px",
                    paddingBlock: "1px",
                    fontSize: "20px",
                },
                baseButtonTypeStyles,
            );

        case "Half":
            return css(
                {
                    blockSize: "36px",
                    inlineSize: "70px",
                    paddingBlock: "1px",
                    fontSize: "16px",
                },
                baseButtonTypeStyles,
            );

        case "Sized":
            return css(
                {
                    blockSize: "auto",
                    inlineSize: "auto",
                    paddingBlock: "5px",
                    fontSize: "16px",
                },
                baseButtonTypeStyles,
            );

        case "Block":
            return css(
                {
                    blockSize: "46px",
                    inlineSize: "90%",
                    paddingBlock: "1px",
                    fontSize: "20px",
                    letterSpacing: "2px",
                },
                baseButtonTypeStyles,
            );

        default:
            return baseButtonTypeStyles;
    }
}

function getColorScheme(
    isDisabled: boolean,
    isDanger: boolean,
    scheme: SchemeType,
) {
    if (isDisabled)
        return {
            backgroundColor:
                scheme === "Normal"
                    ? Colors.Background.base
                    : Colors.Background.inverse,
            borderColor: Colors.Border.subtle,
            fontColor:
                scheme === "Normal" ? Colors.Text.subtle : Colors.Text.inverse,
        };

    if (isDanger)
        return {
            backgroundColor:
                scheme === "Normal"
                    ? Colors.Background.base
                    : Colors.Background.danger,
            backgroundColorActive:
                scheme === "Normal"
                    ? Colors.Background.danger
                    : Colors.Background.base,
            borderColor: Colors.Border.danger,
            fontColor:
                scheme === "Normal" ? Colors.Text.danger : Colors.Text.inverse,
            fontColorActive:
                scheme === "Normal" ? Colors.Text.inverse : Colors.Text.danger,
        };

    return {
        backgroundColor:
            scheme === "Normal"
                ? Colors.Background.base
                : Colors.Background.inverse,
        backgroundColorActive:
            scheme === "Normal"
                ? Colors.Background.inverse
                : Colors.Background.base,
        borderColor: Colors.Border.base,
        fontColor: scheme === "Normal" ? Colors.Text.base : Colors.Text.inverse,
        fontColorActive:
            scheme === "Normal" ? Colors.Text.inverse : Colors.Text.base,
    };
}
