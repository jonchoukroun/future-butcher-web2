/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useEffect, useRef, useState } from "react";

import {
    ButtonPrompt,
    ButtonPromptSize,
    PrintLine,
    ScreenTemplate,
} from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { HighScoresType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";
import { LineSize, PromptScheme } from "../../Components/PrintLine";

type DisplayScoreType = {
    rank: number;
    name: string;
    score: number;
};

export const GameResult = () => {
    const {
        dispatch,
        state: { player },
    } = useGameState();

    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { handleGetScores, handleInitGame } = useChannel();

    const [topScores, setTopScores] = useState<DisplayScoreType[]>();
    const [isLoading, setIsLoading] = useState(false);

    const didRequestScoresRef = useRef(false);
    const lowestScoreIndexRef = useRef<number>();
    const playerIndexRef = useRef<number>();

    const playerName = localStorage.getItem("playerName") ?? "Blondie";

    const { debt, funds } = player;

    useEffect(() => {
        if (topScores || didRequestScoresRef.current) return;

        const getScores = async () => {
            didRequestScoresRef.current = true;
            const response = await handleGetScores();
            if (response === undefined) {
                dispatch({
                    type: "changeScreen",
                    screen: Screen.Error,
                });
            }

            const highScores = response as HighScoresType;
            lowestScoreIndexRef.current = Math.min(highScores.length - 1, 99);
            let displayScores: DisplayScoreType[];

            // If a player has an existing score higher than what they earned this round,
            // they will be a loser
            playerIndexRef.current = highScores.findIndex(
                ({ player, score }) => player === playerName && score === funds,
            );
            if (playerIndexRef.current < 5 && playerIndexRef.current >= 0) {
                displayScores = highScores
                    .slice(0, 5)
                    .map(({ player, score }, idx) => ({
                        rank: idx + 1,
                        name: player,
                        score,
                    }));
            } else {
                const startingIndex = playerIndexRef.current - 1;
                displayScores = highScores
                    .slice(startingIndex, startingIndex + 3)
                    .map(({ player, score }, idx) => ({
                        rank: idx + startingIndex + 1,
                        name: player,
                        score,
                    }));
                if (playerIndexRef.current === lowestScoreIndexRef.current) {
                    const offset = lowestScoreIndexRef.current - 2;
                    displayScores.unshift({
                        rank: offset + 1,
                        name: highScores[offset].player,
                        score: highScores[offset].score,
                    });
                }
                displayScores.unshift({
                    rank: 1,
                    name: highScores[0].player,
                    score: highScores[0].score,
                });
            }
            setTopScores(displayScores);
        };
        getScores();
    }, [
        dispatch,
        funds,
        handleGetScores,
        player.funds,
        player.playerName,
        playerName,
        topScores,
    ]);

    const handleStartOverClick = async () => {
        setIsLoading(true);
        await handleInitGame();

        dispatch({ type: "changeScreen", screen: Screen.Welcome });
        setIsLoading(false);
    };

    const deadbeatSubtitle = "That was pathetic";
    const deadbeatContent = [
        "You get a few miles south of Tijuana and the van pulls over.",
        "The back doors open and you see a couple no-nonsense dudes wearing butcher aprons.",
        "As they drag you from the van, kicking and screaming, you think to yourself...",
        '"I should have paid off that damn debt"',
    ];

    const loserTitle = "You Lose";
    const loserSubtitle = "Not quite there";
    const loserContent = [
        `You try to pay the coyote your measley ${formatMoney(funds)}.`,
        "He glares at you and brandishes a jewel encrusted meat cleaver.",
        '"Don\'t waste my time, pendejo.," he says.',
        "You won't be escaping LA today. Better try again. This time, do better.",
    ];

    // Worst ending - player gets butchered
    if (debt > 0) {
        return (
            <ScreenTemplate
                title={loserTitle}
                subtitle={deadbeatSubtitle}
                content={deadbeatContent}
                buttonLabel={"Start Over"}
                isLoading={isLoading}
                clickCB={handleStartOverClick}
            />
        );
    }

    // Prevent empty scores screen
    if (!topScores) return null;

    // Player loses - doesn't make it into top scores
    if (
        lowestScoreIndexRef.current &&
        playerIndexRef.current &&
        lowestScoreIndexRef.current < playerIndexRef.current
    ) {
        return (
            <ScreenTemplate
                title={loserTitle}
                subtitle={loserSubtitle}
                content={loserContent}
                buttonLabel={"Start Over"}
                isLoading={isLoading}
                clickCB={handleStartOverClick}
            />
        );
    }

    // Player wins
    return (
        <WinnerScreen
            displayScores={topScores}
            playerScore={{
                player: playerName,
                score: funds,
            }}
            isLoading={isLoading}
            onStartOverClick={handleStartOverClick}
        />
    );
};

interface WinnerScreenProps {
    displayScores: DisplayScoreType[];
    playerScore: { player: string; score: number };
    isLoading: boolean;
    onStartOverClick: () => void;
}

function WinnerScreen({
    displayScores,
    playerScore,
    isLoading,
    onStartOverClick,
}: WinnerScreenProps) {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const playerIndex = displayScores.findIndex(
        ({ name, score }) =>
            name === playerScore.player && score === playerScore.score,
    );
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
                                        playerIndex === idx
                                            ? Colors.Background.inverse
                                            : Colors.Background.base,
                                    "& h4": {
                                        marginBlock: 0,
                                        paddingBlock: "10px",
                                        color:
                                            playerIndex === idx
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
