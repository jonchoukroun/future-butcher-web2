/** @jsx jsx */
import { jsx } from "@emotion/react";

import * as Animations from "../Styles/animations";

interface PromptProps {
    blink?: boolean;
    hidden?: boolean;
}

export function Prompt({ blink, hidden = false }: PromptProps) {
    return (
        <h4
            css={{
                display: "inline",
                marginInlineEnd: "18px",
                fontSize: "16px",
                animation: blink ? `${Animations.blink} 1s linear infinite` : 0,
                opacity: hidden ? 0 : 1,
            }}
        >
            {">"}
        </h4>
    );
}
