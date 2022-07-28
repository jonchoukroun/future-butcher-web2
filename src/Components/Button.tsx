/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../Styles/colors";

interface ButtonProps {
    label: string;
    inverse?: boolean;
    disabled?: boolean;
    clickCB: () => void;
}

export const Button = ({
    label,
    inverse = false,
    disabled = false,
    clickCB,
}: ButtonProps) => {
    const buttonLayout = buildButtonLayout();

    const {
        backgroundColor,
        backgroundColorActive,
        fontColor,
        fontColorActive,
    } = getColorScheme(inverse, disabled);

    return (
        <button
            css={css(buttonLayout, {
                backgroundColor,
                borderColor: Colors.Border.subtle,
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

function buildButtonLayout() {
    return css({
        inlineSize: "140px",
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
