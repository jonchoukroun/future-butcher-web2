import * as React from "react";

import { useChannel } from "./ChannelProvider";
import { Cut, ApiState } from ".";

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

type Player = {
    playerName: string;
    health: number;
    funds: number;
    debt: number;
    packSpace: number;
    weapon: string | null;
};

type Pack = Record<Cut, number>;

type Market = Record<Cut, { price: number; quantity: number }>;

type GameState = {
    process: GameProcess;
    currentScreen: Screen;
    currentStation?: string;
    turnsLeft?: number;
    player?: Player;
    pack?: Pack;
    market?: Market;
};
type Action =
    | { type: "incrementProcess" }
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: Screen }
    | { type: "updateStateData"; stateData: ApiState };

const GameStateContext = React.createContext<
    { state: GameState; dispatch: (action: Action) => void } | undefined
>(undefined);

function gameStateReducer(state: GameState, action: Action) {
    switch (action.type) {
        case "changeScreen":
            return handleChangeScreen(state, action.screen);

        case "incrementProcess":
            return handleIncrementProcess(state);

        case "updateChannelStatus":
            return { ...state, isConnected: action.isConnected };

        case "updateStateData":
            return handleUpdateState(action.stateData, state);

        default:
            throw new Error("Invalid action type");
    }
}

interface GameStateProviderProps {
    children: React.ReactNode;
}

const { useEffect } = React;

export function GameStateProvider({ children }: GameStateProviderProps) {
    console.log("!!GameStateProvider");
    const {
        didJoinChannel,
        handleInitGame,
        handleJoinChannel,
        isConnected,
    } = useChannel();

    const playerName = localStorage.getItem("playerName");
    const playerHash = localStorage.getItem("playerHash");

    const [state, dispatch] = React.useReducer(gameStateReducer, {
        process: GameProcess.intro,
        currentScreen:
            !playerName || !playerHash ? Screen.Login : Screen.Welcome,
    });

    useEffect(() => {
        const handleRejoin = async () => {
            if (!playerName || !playerHash) return;
            await handleJoinChannel(playerName, playerHash);
            console.log("!!handleRejoin");
        };

        if (isConnected) handleRejoin();
    }, [isConnected]);

    useEffect(() => {
        const initGame = async () => {
            const response = await handleInitGame();
            console.log("!!handleInitGame", response);
            return response;
        };
        if (didJoinChannel) initGame();
    }, [didJoinChannel]);

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

function handleIncrementProcess(state: GameState): GameState {
    if (state.process === GameProcess.end)
        throw new Error("Cannot increment, already at game end");

    return { ...state, process: state.process + 1 };
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

function handleUpdateState(
    apiState: ApiState,
    currentState: GameState,
): GameState {
    const { process, currentScreen } = currentState;
    const {
        player: { player_name, funds, debt, weapon, pack, pack_space },
        station: { market, station_name },
        rules: { turns_left },
    } = apiState;

    return {
        process,
        currentScreen,
        turnsLeft: turns_left,
        currentStation: station_name,
        player: {
            playerName: player_name,
            health: 100,
            funds,
            debt,
            weapon,
            packSpace: pack_space,
        },
        pack,
        market,
    };
}
