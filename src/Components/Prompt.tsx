/** @jsx jsx */
import { jsx } from "@emotion/react";

import * as Animations from "../Styles/animations";

interface PromptProps {
    blink?: boolean;
}

export function Prompt({ blink }: PromptProps) {
    return (
        <h4
            css={{
                display: "inline",
                marginInlineEnd: "18px",
                fontSize: "16px",
                animation: blink ? `${Animations.blink} 1s linear infinite` : 0,
            }}
        >
            {">"}
        </h4>
    );
}
