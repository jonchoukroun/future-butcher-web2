/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";

import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

export const enum ButtonSize {
    Full = "Full",
    Compact = "Compact",
}
type ButtonSizeType = typeof ButtonSize[keyof typeof ButtonSize];
export const enum ButtonScheme {
    Normal = "Normal",
    Inverse = "Inverse",
    Hidden = "Hidden",
}
type ButtonSchemeType = typeof ButtonScheme[keyof typeof ButtonScheme];

interface ButtonProps {
    label: string;
    size: ButtonSizeType;
    scheme?: ButtonSchemeType;
    blink?: boolean;
    isDisabled?: boolean;
    isDanger?: boolean;
    isLoading?: boolean;
    clickCB: () => void;
}

export const Button = ({
    label,
    size,
    scheme = ButtonScheme.Normal,
    blink = false,
    isDisabled = false,
    isLoading = false,
    clickCB,
}: ButtonProps) => {
    const buttonTypeStyles = getButtonTypeStyles(size);
    const {
        backgroundColor,
        backgroundColorActive,
        fontColor,
        fontColorActive,
    } = getColorScheme(scheme);

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
                opacity: scheme === ButtonScheme.Hidden ? 0 : 1,
            })}
            onClick={clickCB}
            disabled={isDisabled || scheme === ButtonScheme.Hidden}
        >
            {isLoading ? <FontAwesomeIcon icon={faRedo} /> : label}
        </button>
    );
};

function getButtonTypeStyles(size: ButtonSize) {
    const baseButtonTypeStyles = css({
        margin: 0,
        fontFamily: "'Courier New', Courier, monospace",
        fontWeight: 800,
        lineHeight: "26px",
        textTransform: "uppercase",
    });

    switch (size) {
        case ButtonSize.Full:
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

        case ButtonSize.Compact:
            return css(
                {
                    blockSize: "auto",
                    inlineSize: "auto",
                    paddingBlock: "5px",
                    fontSize: "16px",
                },
                baseButtonTypeStyles,
            );

        default:
            return baseButtonTypeStyles;
    }
}

function getColorScheme(scheme: ButtonScheme) {
    return {
        backgroundColor:
            scheme === ButtonScheme.Normal
                ? Colors.Background.inverse
                : Colors.Background.base,
        backgroundColorActive:
            scheme === ButtonScheme.Normal
                ? Colors.Background.base
                : Colors.Background.inverse,
        fontColor:
            scheme === ButtonScheme.Normal
                ? Colors.Text.inverse
                : Colors.Text.base,
        fontColorActive:
            scheme === ButtonScheme.Normal
                ? Colors.Text.base
                : Colors.Text.inverse,
    };
}
