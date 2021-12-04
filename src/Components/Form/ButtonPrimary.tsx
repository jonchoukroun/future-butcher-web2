/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../../Styles/colors";

type ButtonType = "Full" | "Half" | "Sized" | "Stretch";

interface ButtonPrimaryProps {
    type: ButtonType;
    label: string;
    isDisabled?: boolean;
    clickCB: () => void;
}

export const ButtonPrimary = ({
    type,
    label,
    isDisabled,
    clickCB,
}: ButtonPrimaryProps) => {
    const [blockSize, inlineSize] = getDimensions(type);
    return (
        <button
            css={css({
                blockSize,
                inlineSize,
                marginBlock: "5px",
                marginInline: 0,
                backgroundColor: Colors.Background.screen,
                borderColor: isDisabled
                    ? Colors.Border.subtle
                    : Colors.Border.standard,
                borderRadius: "7px",
                borderStyle: "solid",
                borderWidth: "2px",
                color: isDisabled ? Colors.Text.secondary : Colors.Text.primary,
                "&:active": {
                    backgroundColor: Colors.Background.subtle,
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

function getDimensions(type: ButtonType) {
    switch (type) {
        case "Full":
            return ["32px", "140px"];

        case "Half":
            return ["32px", "70px"];

        case "Sized":
            return ["auto", "auto"];

        case "Stretch":
            return ["32px", "80%"];

        default:
            return ["100%", "100%"];
    }
}
