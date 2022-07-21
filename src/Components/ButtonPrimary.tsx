/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

import * as Animations from "../Styles/animations";
import * as Colors from "../Styles/colors";

type ButtonType = "Full" | "Half" | "Sized" | "Block";
type BorderType = "Full" | "Thin" | "None";
type SchemeType = "Normal" | "Inverse";

interface ButtonPrimaryProps {
    type: ButtonType;
    label: string;
    scheme?: SchemeType;
    blink?: boolean;
    border?: BorderType;
    isDisabled?: boolean;
    isDanger?: boolean;
    isLoading?: boolean;
    clickCB: () => void;
}

export const ButtonPrimary = ({
    type,
    label,
    scheme = "Normal",
    blink = false,
    isDisabled = false,
    isDanger = false,
    isLoading = false,
    clickCB,
}: ButtonPrimaryProps) => {
    const buttonTypeStyles = getButtonTypeStyles(type);
    const {
        backgroundColor,
        backgroundColorActive,
        fontColor,
        fontColorActive,
    } = getColorScheme(isDisabled, isDanger, scheme);

    return (
        <button
            css={css(buttonTypeStyles, {
                backgroundColor,
                borderStyle: "none",
                color: fontColor,
                animation: blink ? `${Animations.blink} 1s ease` : "",
                "&:active": {
                    backgroundColor: backgroundColorActive,
                    color: fontColorActive,
                },
                fontStyle: isDisabled ? "italic" : "normal",
                "& svg": {
                    animation: `${Animations.spin} 2s ease`,
                },
            })}
            onClick={clickCB}
            disabled={isDisabled}
        >
            {isLoading ? <FontAwesomeIcon icon={faRedo} /> : label}
        </button>
    );
};

function getButtonTypeStyles(type: ButtonType) {
    const baseButtonTypeStyles = css({
        margin: 0,
        fontFamily: "'Courier New', Courier, monospace",
        fontWeight: 800,
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
                    inlineSize: "100%",
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
            fontColor:
                scheme === "Normal" ? Colors.Text.disable : Colors.Text.inverse,
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
        fontColor: scheme === "Normal" ? Colors.Text.base : Colors.Text.inverse,
        fontColorActive:
            scheme === "Normal" ? Colors.Text.inverse : Colors.Text.base,
    };
}
