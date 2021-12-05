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
    border?: BorderType;
    clickCB: () => void;
}

export const ButtonPrimary = ({
    type,
    label,
    isDisabled,
    border = "Full",
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
                paddingBlock: type === "Small" ? "5px" : "1px",
                backgroundColor: Colors.Background.screen,
                borderColor: isDisabled
                    ? Colors.Border.subtle
                    : Colors.Border.standard,
                borderRadius: "7px",
                borderStyle: border === "None" ? "none" : "solid",
                borderWidth: border === "Full" ? "2px" : "1px",
                color: isDisabled ? Colors.Text.secondary : Colors.Text.primary,
                "&:active": {
                    backgroundColor: Colors.Background.subtle,
                },
                fontFamily: "Share Tech Mono",
                fontSize: type === "Small" ? "14px" : "20px",
                fontStyle: isDisabled ? "italic" : "normal",
                fontVariantCaps: type === "Small" ? "all-small-caps" : "normal",
                lineHeight: type === "Small" ? "14px" : "26px",
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
    const standardHeight = layout === "full" ? "46px" : "32px";

    switch (type) {
        case "Full":
            return [standardHeight, "140px"];

        case "Half":
            return [standardHeight, "70px"];

        case "Small":
            return ["auto", "auto"];

        case "Stretch":
            return [standardHeight, "80%"];

        default:
            return ["100%", "100%"];
    }
}
