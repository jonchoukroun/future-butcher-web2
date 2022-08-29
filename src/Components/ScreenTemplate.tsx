/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrompt, ButtonPromptSize } from "./ButtonPrompt";
import { LineSize, PromptScheme, PrintLine } from "./PrintLine";
import { useWindowSize } from "./Window/WindowSizeProvider";

import * as Colors from "../Styles/colors";

interface ScreenTemplateProps {
    title: string;
    subtitle?: string;
    danger?: boolean;
    content: string[];
    primaryButtonLabel: string;
    primaryIsLoading: boolean;
    primaryIsDisabled?: boolean;
    primaryClickCB: () => void;
    secondaryButtonLabel?: string;
    secondaryIsLoading?: boolean;
    secondaryIsDisabled?: boolean;
    secondaryClickCB?: () => void;
}

export function ScreenTemplate({
    title,
    subtitle,
    danger = false,
    content,
    primaryButtonLabel,
    primaryIsLoading = false,
    primaryIsDisabled = false,
    primaryClickCB,
    secondaryButtonLabel,
    secondaryIsLoading = false,
    secondaryIsDisabled = false,
    secondaryClickCB,
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
                    marginBlockStart: "30px",
                    marginBlockEnd: "48px",
                    borderBottomColor: danger
                        ? Colors.Border.danger
                        : Colors.Border.subtle,
                    borderBottomStyle: "dashed",
                    borderBottomWidth: "2px",
                }}
            >
                <PrintLine
                    text={title}
                    size={LineSize.Title}
                    danger={danger}
                    promptScheme={PromptScheme.Hidden}
                />
                {subtitle && (
                    <PrintLine
                        text={subtitle}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Hidden}
                    />
                )}
            </div>

            <div css={{ marginBlockStart: "auto" }}>
                {content.map((line, idx) => (
                    <PrintLine
                        key={`content-line-${idx}`}
                        promptScheme={PromptScheme.Past}
                        text={line}
                        size={LineSize.Body}
                    />
                ))}

                <div css={{ inlineSize: "100%", marginBlockStart: "20px" }}>
                    <ButtonPrompt
                        label={primaryButtonLabel}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        loading={primaryIsLoading}
                        disabled={primaryIsDisabled}
                        clickCB={primaryClickCB}
                    />
                </div>

                {secondaryButtonLabel && secondaryClickCB && (
                    <ButtonPrompt
                        label={secondaryButtonLabel}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        loading={secondaryIsLoading}
                        disabled={secondaryIsDisabled}
                        clickCB={secondaryClickCB}
                    />
                )}
            </div>
        </div>
    );
}
