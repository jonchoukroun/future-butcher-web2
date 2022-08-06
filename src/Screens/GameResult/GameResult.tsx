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
import { HighScoresType, PlayerType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";
import { LineSize, PromptScheme } from "../../Components/PrintLine";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";

export const GameResult = () => {
    const { dispatch } = useGameState();

    const player: PlayerType = {
        debt: 0,
        // debt: 1000,
        // funds: 97485,
        funds: 73600,
        // funds: 1000,
        health: 100,
        playerName: "Boris",
        pack: { brains: 0, flank: 0, liver: 0, ribs: 0, heart: 0 },
        totalPackSpace: 20,
        weapon: null,
    };

    // if (player === undefined) {
    //     throw new Error("State is undefined");
    // }

    const { handleGetScores, handleInitGame } = useChannel();

    const [topScores, setTopScores] = useState<HighScoresType>();
    const [isLoading, setIsLoading] = useState(false);

    const didRequestScoresRef = useRef(false);

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

            setTopScores(response as HighScoresType);
        };
        getScores();
    }, [dispatch, handleGetScores, topScores]);

    const lowestScore = topScores
        ? topScores[Math.min(topScores.length - 1, 99)].score
        : undefined;

    const { debt, funds } = player;

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
        `You try to pay the coyote your measley ${formatMoney(player.funds)}.`,
        "He glares at you and brandishes a jewel encrusted meat cleaver.",
        '"Don\'t waste my time, pendejo.," he says.',
        "You won't be escaping LA today. Better try again. This time, do better.",
    ];

    return (
        <Fragment>
            {topScores && lowestScore ? (
                <Fragment>
                    {lowestScore >= funds ? (
                        <ScreenTemplate
                            title={loserTitle}
                            subtitle={loserSubtitle}
                            content={loserContent}
                            buttonLabel={"Start Over"}
                            isLoading={isLoading}
                            clickCB={handleStartOverClick}
                        />
                    ) : (
                        <Fragment>
                            {debt > 0 ? (
                                <ScreenTemplate
                                    title={loserTitle}
                                    subtitle={deadbeatSubtitle}
                                    content={deadbeatContent}
                                    buttonLabel={"Start Over"}
                                    isLoading={isLoading}
                                    clickCB={handleStartOverClick}
                                />
                            ) : (
                                <WinnerScreen
                                    topScores={topScores}
                                    playerScore={funds}
                                    isLoading={isLoading}
                                    onStartOverClick={handleStartOverClick}
                                />
                            )}
                        </Fragment>
                    )}
                </Fragment>
            ) : null}
        </Fragment>
    );
};

interface WinnerScreenProps {
    topScores: HighScoresType;
    playerScore: number;
    isLoading: boolean;
    onStartOverClick: () => void;
}

function WinnerScreen({
    topScores,
    playerScore,
    isLoading,
    onStartOverClick,
}: WinnerScreenProps) {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const playerName = localStorage.getItem("playerName") || "Blondie";

    console.log("!!topScores", topScores);
    const playerScoreIndex = topScores.findIndex(
        ({ score }) => score === playerScore,
    );
    if (topScores[playerScoreIndex].player !== playerName) {
        handleMessage(
            "Player score index does not match player",
            MessageLevel.Info,
        );
    }
    const startingIndex = Math.max(0, playerScoreIndex - 2);
    const displayScores = Array.from(
        topScores.slice(startingIndex, startingIndex + 3),
    );

    const winnerTitle = playerScoreIndex === 0 ? "You Win!" : "Well Done";

    const winnerContent = [
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
                    text={winnerTitle}
                    size={LineSize.Title}
                    promptScheme={PromptScheme.Hidden}
                />
            </div>

            <div css={{ inlineSize: "100%", marginBlockStart: "auto" }}>
                {displayScores.map(({ player, score }, idx) => (
                    <div key={`displayScore-${idx}`} css={{ display: "flex" }}>
                        <h4>
                            {idx + 1}. {player}
                        </h4>
                        <h4 css={{ marginInlineStart: "auto" }}>
                            {formatMoney(score)}
                        </h4>
                    </div>
                ))}
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
