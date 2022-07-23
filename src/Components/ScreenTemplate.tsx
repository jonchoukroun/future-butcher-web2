/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrompt, ButtonPromptSize } from "./ButtonPrompt";
import { PrintLine, LineSize } from "./PrintLine";
import { useWindowSize } from "./Window/WindowSizeProvider";

import * as Colors from "../Styles/colors";

interface ScreenTemplateProps {
    title: string;
    subtitle?: string;
    content: string[];
    buttonLabel: string;
    isLoading: boolean;
    clickCB: () => void;
}

export function ScreenTemplate({
    title,
    subtitle,
    content,
    buttonLabel,
    isLoading,
    clickCB,
}: ScreenTemplateProps) {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: `${inlineSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingInline: "10px",
            }}
        >
            <div
                css={{
                    inlineSize: "100%",
                    marginBlockStart: "50px",
                    marginBlockEnd: "75px",
                    borderBottomColor: Colors.Border.subtle,
                    borderBottomStyle: "dashed",
                    borderBottomWidth: "2px",
                }}
            >
                <PrintLine
                    text={title}
                    size={LineSize.Title}
                    showPrompt={false}
                />
                {subtitle && (
                    <PrintLine
                        text={subtitle}
                        size={LineSize.Body}
                        showPrompt={false}
                    />
                )}
            </div>

            <div css={{ marginBlockStart: "auto" }}>
                {content.map((line, idx) => (
                    <PrintLine
                        key={`content-line-${idx}`}
                        text={line}
                        size={LineSize.Body}
                    />
                ))}

                <div css={{ inlineSize: "100%", marginBlockStart: "20px" }}>
                    <ButtonPrompt
                        label={buttonLabel}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        loading={isLoading}
                        clickCB={clickCB}
                    />
                </div>
            </div>
        </div>
    );
}
