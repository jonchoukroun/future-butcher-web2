/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";
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
                paddingBlock: type === "Sized" ? "5px" : "1px",
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
                fontFamily: "Michroma",
                fontStyle: isDisabled ? "italic" : "normal",
                textTransform: "uppercase",
                wordSpacing: "4px",
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

        case "Sized":
            return ["auto", "auto"];

        case "Stretch":
            return [standardHeight, "80%"];

        default:
            return ["100%", "100%"];
    }
}
