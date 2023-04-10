/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { HighScoresType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";
import { ButtonPrompt, ButtonPromptSize, PrintLine } from "../../Components";
import { LineSize, PromptScheme } from "../../Components/PrintLine";

export function HighScores() {
    const { handleGetScores } = useChannel();

    const {
        dispatch,
        state: { currentStation },
    } = useGameState();

    const { getContentSize, layout } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const [topScores, setTopScores] = useState<HighScoresType>();
    const didRequestScoresRef = useRef(false);
    useEffect(() => {
        if (didRequestScoresRef.current) return;

        const getScores = async () => {
            didRequestScoresRef.current = true;

            const response = await handleGetScores();
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
            }
            if (response) {
                setTopScores((response as HighScoresType).slice(0, 10));
            }
        };

        getScores();
    }, [dispatch, handleGetScores, topScores]);

    const handleBackClick = () => {
        if (layout === "compact") {
            dispatch({ type: "changeScreen", screen: Screen.Stats });
        } else {
            const screen =
                currentStation === "bell_gardens"
                    ? Screen.Store
                    : currentStation === "venice_beach"
                    ? Screen.Clinic
                    : Screen.Market;
            dispatch({ type: "changeScreen", screen });
        }
    };

    const maxPlayerSize = Math.floor(inlineSize * 0.6);

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
                    text={"Top 10 Scores"}
                    size={LineSize.Title}
                    promptScheme={PromptScheme.Hidden}
                />
            </div>

            {topScores && (
                <div css={{ inlineSize: "100%", marginBlockStart: "auto" }}>
                    {topScores.map(({ player, score }, idx) => (
                        <div
                            key={`top-score-${idx}`}
                            css={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingInline: "5px",
                                "& h4": {
                                    marginBlock: "10px",
                                },
                            }}
                        >
                            <h4
                                css={{
                                    maxInlineSize: `${maxPlayerSize}px`,
                                    overflowX: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {idx + 1}. {player}
                            </h4>
                            <h4 css={{ minBlockSize: "33%" }}>
                                {formatMoney(score)}
                            </h4>
                        </div>
                    ))}
                </div>
            )}

            <div css={{ inlineSize: "100%", marginBlockStart: "20px" }}>
                <ButtonPrompt
                    label={"Back"}
                    size={ButtonPromptSize.Full}
                    blink={true}
                    loading={false}
                    disabled={false}
                    clickCB={handleBackClick}
                />
            </div>
        </div>
    );
}
