/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";

export const enum LineSize {
    Body,
    Title,
}
type LineSizeType = typeof LineSize[keyof typeof LineSize];

interface PrintLineProps {
    text: string;
    size: LineSizeType;
    showPrompt?: boolean;
}

export function PrintLine({
    text,
    size = LineSize.Body,
    showPrompt = true,
}: PrintLineProps) {
    return (
        <div
            css={{
                display: "flex",
                alignItems: size === LineSize.Title ? "center" : "flex-start",
                marginBlockEnd: "8px",
                "& h1, h4": { color: Colors.Text.base, marginBlock: 0 },
            }}
        >
            <Prompt hidden={!showPrompt} />
            {size === LineSize.Title ? <h1>{text}</h1> : <h4>{text}</h4>}
        </div>
    );
}
