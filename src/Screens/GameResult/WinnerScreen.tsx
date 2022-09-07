/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment } from "react";

import { DisplayScoreType } from "./GameResult";
import { ButtonPrompt, ButtonPromptSize, PrintLine } from "../../Components";
import { LineSize, PromptScheme } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";

interface WinnerScreenProps {
    displayScores: DisplayScoreType[];
    playerIndex: number;
    isLoading: boolean;
    onStartOverClick: () => void;
}

export function WinnerScreen({
    displayScores,
    playerIndex,
    isLoading,
    onStartOverClick,
}: WinnerScreenProps) {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const title = playerIndex === 0 ? "You Win!" : "Well Done";
    const content =
        playerIndex === 0
            ? [
                  "You arrive in Mexico a legend!",
                  "Other meat hustlers who made it out line up to buy you cervezas, but you get bored quick.",
                  "Despite the easy life, you feel the lure of the meat markets...",
              ]
            : [
                  "The trip into Mexico is long but uneventful. You spend your cash on a beach casita and settle down.",
                  "But the pull of the meat game is strong...",
              ];

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: `${inlineSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginInline: "auto",
                paddingInline: "10px",
            }}
        >
            <div
                css={{
                    inlineSize: "100%",
                    marginBlockStart: "30px",
                    marginBlockEnd: "48px",
                    borderBottomColor: Colors.Border.subtle,
                    borderBottomStyle: "dashed",
                    borderBottomWidth: "2px",
                }}
            >
                <PrintLine
                    text={title}
                    size={LineSize.Title}
                    promptScheme={PromptScheme.Hidden}
                />
            </div>

            <div css={{ inlineSize: "100%", marginBlockStart: "auto" }}>
                {content.map((line, idx) => (
                    <PrintLine
                        key={`winner-content-${idx}`}
                        text={line}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />
                ))}
                {playerIndex !== 0 && (
                    <PrintLine
                        text={"How do you compare?"}
                        size={LineSize.Body}
                    />
                )}

                <ul
                    css={{
                        marginBlockStart: "50px",
                        padding: 0,
                        listStyleType: "none",
                    }}
                >
                    {displayScores.map(({ rank, name, score }, idx) => (
                        <Fragment key={`displayScore-${idx}`}>
                            {idx > 0 && rank - displayScores[idx - 1].rank > 1 && (
                                <li
                                    css={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <h4 css={{ marginBlock: 0 }}>...</h4>
                                </li>
                            )}
                            <li
                                css={{
                                    display: "flex",
                                    paddingInline: "5px",
                                    backgroundColor:
                                        playerIndex === rank - 1
                                            ? Colors.Background.inverse
                                            : Colors.Background.base,
                                    "& h4": {
                                        marginBlock: 0,
                                        paddingBlock: "10px",
                                        color:
                                            playerIndex === rank - 1
                                                ? Colors.Text.inverse
                                                : Colors.Text.base,
                                    },
                                }}
                            >
                                <h4>
                                    {rank}. {name}
                                </h4>
                                <h4
                                    css={{
                                        marginInlineStart: "auto",
                                    }}
                                >
                                    {formatMoney(score)}
                                </h4>
                            </li>
                        </Fragment>
                    ))}
                </ul>
                <div css={{ inlineSize: "100%", marginBlockStart: "20px" }}>
                    <ButtonPrompt
                        label={"Start Over"}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        loading={isLoading}
                        clickCB={onStartOverClick}
                    />
                </div>
            </div>
        </div>
    );
}
