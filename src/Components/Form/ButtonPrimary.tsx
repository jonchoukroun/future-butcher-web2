/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

type ButtonType = "Full" | "Half" | "Small" | "Stretch";
type BorderType = "Full" | "Thin" | "None";

interface ButtonPrimaryProps {
    type: ButtonType;
    label: string;
    isDisabled?: boolean;
    isDanger?: boolean;
    border?: BorderType;
    clickCB: () => void;
}

export const ButtonPrimary = ({
    type,
    label,
    isDisabled,
    isDanger,
    border = "Full",
    clickCB,
}: ButtonPrimaryProps) => {
    const [blockSize, inlineSize] = getDimensions(type);
    const fontSize = getFontSize(type);
    return (
        <button
            css={css({
                blockSize,
                inlineSize,
                marginBlock: 0,
                marginInline: 0,
                paddingBlock: type === "Small" ? "5px" : "1px",
                backgroundColor: Colors.Background.base,
                borderColor: isDisabled
                    ? Colors.Border.subtle
                    : isDanger
                    ? Colors.Border.danger
                    : Colors.Border.base,
                borderRadius: "2px",
                borderStyle: border === "None" ? "none" : "solid",
                borderWidth: border === "Full" ? "2px" : "1px",
                color: isDisabled
                    ? Colors.Text.subtle
                    : isDanger
                    ? Colors.Text.danger
                    : Colors.Text.base,
                "&:active": {
                    backgroundColor: Colors.Background.invert,
                    color: Colors.Text.invert,
                },
                fontFamily: "Share Tech Mono",
                fontSize,
                fontStyle: isDisabled ? "italic" : "normal",
                fontVariantCaps: type === "Small" ? "all-small-caps" : "normal",
                lineHeight: type === "Small" ? "14px" : "26px",
                textTransform: type === "Small" ? "none" : "uppercase",
            })}
            onClick={clickCB}
            disabled={isDisabled}
        >
            {label}
        </button>
    );
};

function getDimensions(type: ButtonType) {
    const { layout } = useWindowSize();
    const standardHeight = layout === "full" ? "46px" : "38px";

    switch (type) {
        case "Full":
            return [standardHeight, "140px"];

        case "Half":
            return [standardHeight, "70px"];

        case "Small":
            return ["auto", "auto"];

        case "Stretch":
            return [standardHeight, "90%"];

        default:
            return ["100%", "100%"];
    }
}

function getFontSize(type: ButtonType) {
    switch (type) {
        case "Full":
            return "20px";
        case "Stretch":
            return "20px";
        case "Half":
            return "16px";
        default:
            return "14px";
    }
}
