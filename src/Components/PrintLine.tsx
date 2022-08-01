/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
import * as Colors from "../Styles/colors";

export const enum LineSize {
    Body,
    Notification,
    Title,
}
type LineSizeType = typeof LineSize[keyof typeof LineSize];

// FIXME: use template string and enum for typed access
export const enum PromptScheme {
    Base = "base",
    Past = "past",
    Hidden = "hidden",
}
type PromptSchemeType = `${PromptScheme}`;

interface PrintLineProps {
    text: string;
    size: LineSizeType;
    danger?: boolean;
    promptScheme?: PromptSchemeType;
    marginBlockEnd?: string;
}

export function PrintLine({
    text,
    size = LineSize.Body,
    danger = false,
    promptScheme = PromptScheme.Base,
    marginBlockEnd = "8px",
}: PrintLineProps) {
    const color = danger ? Colors.Text.danger : Colors.Text.base;
    const promptColor =
        promptScheme === PromptScheme.Past
            ? Colors.Text.disable
            : Colors.Text.base;
    return (
        <div
            css={{
                display: "flex",
                alignItems: size === LineSize.Body ? "flex-start" : "center",
                marginBlockEnd,
            }}
        >
            <Prompt
                symbol={size === LineSize.Notification ? "<!>" : ">"}
                color={promptColor}
                hidden={promptScheme === PromptScheme.Hidden}
            />
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
                        marginBlock: 0,
                        color,
                        textTransform:
                            size === LineSize.Title ? "capitalize" : "none",
                    }}
                >
                    {text}
                </h1>
            );

        case LineSize.Notification:
            return <h3 css={{ color, marginBlock: 0 }}>{text}</h3>;

        case LineSize.Body:
            return <h4 css={{ color, marginBlock: 0 }}>{text}</h4>;

        default:
            throw new Error(`Error: Invalid line size: ${size}`);
    }
}
