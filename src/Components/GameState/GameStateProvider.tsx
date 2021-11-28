import * as React from "react";

const { createContext, useContext, useState } = React;

const enum Station {
    Compton = "Compton",
    Hollywood = "Hollywood",
    VeniceBeach = "Venice Beach",
    Downtown = "Downtown",
    BeverlyHills = "Beverly Hills",
}

type GameState = {
    currentStation: Station;
    playerName: string | undefined;
    savePlayerName: (playerName: string) => void;
};

const GameStateContext = createContext<GameState | undefined>(undefined);

/**
 * This provider manages state for the game including the player.
 */
export function GameStateProvider({ children }: { children: React.ReactNode }) {
    const [currentStation] = useState<Station>(Station.Compton);

    const [playerName, setPlayerName] = useState<string | undefined>(undefined);
    const savePlayerName = (playerName: string) => {
        // validate player name
        setPlayerName(playerName);
    };

    const value = {
        currentStation,
        playerName,
        savePlayerName,
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
