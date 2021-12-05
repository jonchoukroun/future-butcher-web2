import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useWindowSize } from "../Window/WindowSizeProvider";
import { player, PlayerStatsType } from "../../Fixtures/player";

const { createContext, useContext, useState } = React;

export const enum GameProcess {
    intro,
    inGame,
    end,
}

export enum Screen {
    Welcome = "Future Butcher",
    Main = "Main",
    Subway = "Subway",
    Market = "Market",
    SurplusStore = "Gus's Army Surplus",
    HardwareStore = "Hardware Store",
    Bank = "Bank",
    Clinic = "Free Clinic",
    Stats = "Stats",
    HighScores = "High Scores",
}

type GameState = {
    process: GameProcess;
    incrementGameProcess: () => void;
    currentScreen: Screen;
    changeScreen: (screen: Screen) => void;
    currentStation: string;
    turnsLeft: number;
    playerStats: PlayerStatsType;
};

const GameStateContext = createContext<GameState | undefined>(undefined);

/**
 * This provider manages state for the game including the player.
 */
export function GameStateProvider({ children }: { children: React.ReactNode }) {
    const { layout } = useWindowSize();

    const [process, setProcess] = useState(GameProcess.intro);

    const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
        if (process === GameProcess.intro) return Screen.Welcome;
        if (process === GameProcess.end) return Screen.HighScores;
        return Screen.Market;
    });
    const changeScreen = (screen: Screen) => {
        if (process === GameProcess.intro) return Screen.Welcome;
        if (process === GameProcess.end) return Screen.HighScores;
        if (process !== GameProcess.inGame)
            throw new Error(`Invalid process: ${process}`);

        if (screen === Screen.Welcome) return currentScreen;
        if (screen === Screen.Stats && layout !== "compact")
            return currentScreen;

        setCurrentScreen(screen);
    };

    const incrementGameProcess = () =>
        unstable_batchedUpdates(() => {
            setProcess((currentProcess) => {
                if (currentProcess === GameProcess.end) return currentProcess;
                return currentProcess + 1;
            });
            setCurrentScreen(Screen.Main);
        });

    const [currentStation] = useState("compton");

    const [turnsLeft] = useState(24);

    const [playerStats] = useState(player);

    const value = {
        process,
        incrementGameProcess,
        currentScreen,
        changeScreen,
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
