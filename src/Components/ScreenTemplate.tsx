/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrompt, ButtonPromptSize } from "./ButtonPrompt";
import { PrintLine, LineSize } from "./PrintLine";
import { useWindowSize } from "./Window/WindowSizeProvider";

import * as Colors from "../Styles/colors";

interface ScreenTemplatePrompt {
    title: string;
    content: string[];
    clickCB: () => void;
}

export function ScreenTemplate({
    title,
    content,
    clickCB,
}: ScreenTemplatePrompt) {
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
                        label={"Try Again"}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        clickCB={clickCB}
                    />
                </div>
            </div>
        </div>
    );
}
