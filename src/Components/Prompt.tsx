/** @jsx jsx */
import { jsx } from "@emotion/react";

import * as Animations from "../Styles/animations";
import * as Colors from "../Styles/colors";

interface PromptProps {
    symbol?: string;
    color?: string;
    blink?: boolean;
    hidden?: boolean;
}

export function Prompt({
    symbol = ">",
    color = Colors.Text.base,
    blink = false,
    hidden = false,
}: PromptProps) {
    return (
        <h4
            css={{
                display: "inline",
                marginBlock: 0,
                marginInlineEnd: "18px",
                fontSize: "16px",
                color,
                animation: blink ? `${Animations.blink} 1s linear infinite` : 0,
                opacity: hidden ? 0 : 1,
            }}
        >
            {symbol}
        </h4>
    );
}
