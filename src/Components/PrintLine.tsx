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
            }}
        >
            <Prompt hidden={!showPrompt} />
            {buildNode(size, text)}
        </div>
    );
}

function buildNode(size: LineSizeType, text: string) {
    switch (size) {
        case LineSize.Title:
            return (
                <h1
                    css={{
                        fontSize: "28px",
                        color: Colors.Text.base,
                        marginBlock: 0,
                    }}
                >
                    {text}
                </h1>
            );

        case LineSize.Body:
            return (
                <h4 css={{ color: Colors.Text.base, marginBlock: 0 }}>
                    {text}
                </h4>
            );

        default:
            throw new Error(`Error: Invalid line size: ${size}`);
    }
}
