import * as React from "react";

export enum GameProcess {
    intro,
    inGame,
    end,
}

export enum Screen {
    Login = "Login",
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
    currentScreen: Screen;
    currentStation: string;
};
type Action =
    | { type: "incrementProcess" }
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: Screen };

const GameStateContext = React.createContext<
    { state: GameState; dispatch: (action: Action) => void } | undefined
>(undefined);

function gameStateReducer(state: GameState, action: Action) {
    switch (action.type) {
        case "incrementProcess":
            return state;

        case "updateChannelStatus":
            return { ...state, isConnected: action.isConnected };

        case "changeScreen":
            return handleChangeScreen(state, action.screen);

        default:
            throw new Error("Invalid action type");
    }
}

interface GameStateProviderProps {
    children: React.ReactNode;
}

export function GameStateProvider({ children }: GameStateProviderProps) {
    const [state, dispatch] = React.useReducer(gameStateReducer, {
        process: GameProcess.intro,
        currentScreen: Screen.Welcome,
        currentStation: "compton",
    });
    const value = { state, dispatch };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
}

export function useGameState() {
    const context = React.useContext(GameStateContext);
    if (context === undefined)
        throw new Error("useGameState must be called within GameStateProvider");

    return context;
}

function handleChangeScreen(state: GameState, nextScreen: Screen): GameState {
    if (state.currentScreen === nextScreen) return state;

    if (state.process > GameProcess.intro && nextScreen !== Screen.Login) {
        return {
            ...state,
            currentScreen: Screen.Login,
        };
    }

    return {
        ...state,
        currentScreen: nextScreen,
    };
}
