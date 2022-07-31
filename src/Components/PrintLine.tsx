/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";

export const enum LineSize {
    Body,
    Title,
}
type LineSizeType = typeof LineSize[keyof typeof LineSize];

// FIXME: use template string and enum for typed access
type PromptType = "base" | "passed" | "hidden";

interface PrintLineProps {
    text: string;
    size: LineSizeType;
    danger?: boolean;
    prompt?: PromptType;
    marginBlockEnd?: string;
}

export function PrintLine({
    text,
    size = LineSize.Body,
    danger = false,
    prompt = "base",
    marginBlockEnd = "8px",
}: PrintLineProps) {
    const color = danger ? Colors.Text.danger : Colors.Text.base;
    const promptColor =
        prompt === "passed" ? Colors.Text.disable : Colors.Text.base;
    return (
        <div
            css={{
                display: "flex",
                alignItems: size === LineSize.Title ? "center" : "flex-start",
                marginBlockEnd,
            }}
        >
            <Prompt color={promptColor} hidden={prompt === "hidden"} />
            {buildNode(size, text, color)}
        </div>
    );
}

function buildNode(size: LineSizeType, text: string, color: string) {
    switch (size) {
        case LineSize.Title:
            return (
                <h1
                    css={{
                        fontSize: "28px",
                        color,
                        marginBlock: 0,
                    }}
                >
                    {text}
                </h1>
            );

        case LineSize.Body:
            return <h4 css={{ color, marginBlock: 0 }}>{text}</h4>;

        default:
            throw new Error(`Error: Invalid line size: ${size}`);
    }
}
