import * as React from "react";

import { player, PlayerStatsType } from "../../Fixtures/player";

const { createContext, useContext, useState } = React;

type GameState = {
    currentStation: string;
    turnsLeft: number;
    playerStats: PlayerStatsType;
};

const GameStateContext = createContext<GameState | undefined>(undefined);

/**
 * This provider manages state for the game including the player.
 */
export function GameStateProvider({ children }: { children: React.ReactNode }) {
    const [currentStation] = useState("compton");

    const [turnsLeft] = useState(24);

    const [playerStats] = useState(player);

    const value = {
        currentStation,
        turnsLeft,
        playerStats,
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
}

export function useGameState() {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error("useGameState must be used within a GameStateProvider");
    }
    return context;
}
