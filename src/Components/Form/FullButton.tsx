/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import * as Colors from "../../Styles/colors";

interface FullButtonProps {
    label: string;
    clickCB: () => void;
}

export const FullButton = ({ label, clickCB }: FullButtonProps) => {
    return (
        <button
            css={css({
                blockSize: "32px",
                inlineSize: "160px",
                alignSelf: "end",
                marginBlock: "5px",
                marginInline: 0,
                backgroundColor: Colors.Background.body,
                borderWidth: "2px",
                borderStyle: "outset",
                borderBlockStartColor: Colors.Border.light,
                borderInlineStartColor: Colors.Border.light,
                borderBlockEndColor: Colors.Border.dark,
                borderInlineEndColor: Colors.Border.dark,
                borderRadius: "2px",
            })}
            onClick={clickCB}
        >
            {label}
        </button>
    );
};
