/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { WinnerScreen } from "./WinnerScreen";
import { WelcomeScreen } from "../Welcome/Welcome";
import { ScreenTemplate } from "../../Components";
import { HighScoresType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

export type DisplayScoreType = {
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

    const [topScores, setTopScores] = useState<HighScoresType>();
    const [isLoading, setIsLoading] = useState(false);

    const didRequestScoresRef = useRef(false);
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

            setTopScores(response as HighScoresType);
        };
        getScores();
    }, [dispatch, handleGetScores, topScores]);

    const handleStartOverClick = async () => {
        setIsLoading(true);
        const init = await handleInitGame();
        if (init !== "ok") {
            dispatch({ type: "changeScreen", screen: Screen.Error });
        }

        dispatch({
            type: "changeScreen",
            screen: Screen.Welcome,
            screenProps: WelcomeScreen.StartOver,
        });
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
    const loserSubtitle = "Didn't quite make the cut";
    const loserContent = [
        `You try to give the coyote a measley ${formatMoney(funds)}.`,
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

    playerIndexRef.current = topScores
        ? topScores.findIndex(
              ({ player, score }) => player === playerName && score == funds,
          )
        : undefined;

    // Player loses - doesn't make it into top scores
    if (playerIndexRef.current !== undefined && playerIndexRef.current < 0) {
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

    // Prevent empty scores screen
    if (!topScores || playerIndexRef.current === undefined) return null;

    let displayScores: DisplayScoreType[];
    if (playerIndexRef.current < 5 && playerIndexRef.current >= 0) {
        displayScores = topScores.slice(0, 5).map(({ player, score }, idx) => ({
            rank: idx + 1,
            name: player,
            score,
        }));
    } else {
        const startingIndex = playerIndexRef.current - 1;
        displayScores = topScores
            .slice(startingIndex, startingIndex + 3)
            .map(({ player, score }, idx) => ({
                rank: idx + startingIndex + 1,
                name: player,
                score,
            }));

        const lowestScoreIndex = topScores.length - 1;
        if (playerIndexRef.current === lowestScoreIndex) {
            const offset = lowestScoreIndex - 2;
            displayScores.unshift({
                rank: offset + 1,
                name: topScores[offset].player,
                score: topScores[offset].score,
            });
        }
        displayScores.unshift({
            rank: 1,
            name: topScores[0].player,
            score: topScores[0].score,
        });
    }

    return (
        <WinnerScreen
            displayScores={displayScores}
            playerIndex={playerIndexRef.current}
            isLoading={isLoading}
            onStartOverClick={handleStartOverClick}
        />
    );
};
