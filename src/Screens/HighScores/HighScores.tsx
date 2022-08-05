/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

export const HighScores = () => {
    const {
        state: { player },
        dispatch,
    } = useGameState();

    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { handleInitGame } = useChannel();

    const [isLoading, setIsLoading] = useState(false);

    const playerName = player.playerName || localStorage.getItem("playerName");
    const playerScore = parseInt(localStorage.getItem("playerScore") || "0");

    const handleStartOverClick = async () => {
        setIsLoading(true);
        await handleInitGame();

        dispatch({ type: "changeScreen", screen: Screen.Welcome });
        setIsLoading(false);
    };

    const deadbeatContent = [
        "You get a few miles south of Tijuana and the van pulls over.",
        "The back doors open and you see a couple no-nonsense dudes wearing butcher aprons.",
        "As they drag you from the van, kicking and screaming, you think to yourself...",
        '"I should have paid off that damn debt"',
    ];

    const winnerContent = [
        "The trip into Mexico is long but uneventful.",
        "You feel generous and tip the coyote well, but he doesn't crack a smile.",
        "You spend your cash on a house by the beach and settle down.",
        "But the pull of the meat game is strong and you keep thinking of LA...",
    ];

    return (
        <ScreenTemplate
            title={"Game Over"}
            subtitle={
                playerScore > 0
                    ? `Well played, ${playerName}`
                    : "Terrible, just terrible"
            }
            content={playerScore > 0 ? winnerContent : deadbeatContent}
            buttonLabel={"Start Over"}
            isLoading={isLoading}
            clickCB={handleStartOverClick}
        />
    );
};
