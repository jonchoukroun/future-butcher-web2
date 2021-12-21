import * as React from "react";

import { useChannel, Callback } from "../PhoenixChannel/ChannelProvider";
import { ApiState } from "../PhoenixChannel";
import { unstable_batchedUpdates } from "react-dom";

export enum Screen {
    Login = "Login",
    Welcome = "Future Butcher",
    Main = "Main",
    Subway = "Subway",
    Market = "Market",
    // SurplusStore = "Gus's Army Surplus",
    // HardwareStore = "Hardware Store",
    // Bank = "Bank",
    // Clinic = "Free Clinic",
    Stats = "Stats",
    HighScores = "High Scores",
    Mugging = "Mugging",
    EndGame = "End Game",
    Error = "Error SCreen",
}

type Player = {
    playerName: string;
    health: number;
    funds: number;
    debt: number;
    packSpace: number;
    weapon: string | null;
};

type Pack = Record<string, number>;

type Market = Record<string, { price: number; quantity: number }>;

type GameProcess = "initialized" | "in_game" | "mugging" | "game_over";

type HighScores = { player: string; score: number }[];

type GameState = {
    currentScreen?: Screen;
    currentProcess?: GameProcess;
    currentStation?: string;
    turnsLeft?: number;
    player?: Player;
    pack?: Pack;
    spaceAvailable?: number;
    market?: Market;
    highScores?: HighScores;
};
type Action =
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: Screen }
    | { type: "updateStateData"; stateData: ApiState }
    | { type: "setHighScores"; highScores: HighScores };

const GameStateContext = React.createContext<
    { state: GameState; dispatch: (action: Action) => void } | undefined
>(undefined);

function gameStateReducer(state: GameState, action: Action) {
    switch (action.type) {
        case "changeScreen":
            return handleChangeScreen(state, action.screen);

        case "updateChannelStatus":
            return { ...state, isConnected: action.isConnected };

        case "updateStateData":
            return handleUpdateState(action.stateData, state);

        case "setHighScores":
            return { ...state, highScores: action.highScores };
        default:
            throw new Error("Invalid action type");
    }
}

interface GameStateProviderProps {
    children: React.ReactNode;
}

const { useEffect } = React;

export function GameStateProvider({ children }: GameStateProviderProps) {
    const {
        didJoinChannel,
        handleInitGame,
        handleJoinChannel,
        handlePushCallback,
        isConnected,
        isDisconnected,
    } = useChannel();

    const playerName = localStorage.getItem("playerName");
    const playerHash = localStorage.getItem("playerHash");

    const [state, dispatch] = React.useReducer(gameStateReducer, {});

    useEffect(() => {
        if (!isDisconnected) return;

        dispatch({ type: "changeScreen", screen: Screen.Error });
    }, [isDisconnected]);

    useEffect(() => {
        const handleJoin = async () => {
            if (!playerName || !playerHash) {
                dispatch({ type: "changeScreen", screen: Screen.Login });
                return;
            }
            const reply = await handleJoinChannel(playerName, playerHash);
            if (reply === "join crashed") {
                dispatch({ type: "changeScreen", screen: Screen.Login });
            }
        };
        if (isConnected) handleJoin();
    }, [isConnected]);

    useEffect(() => {
        const initGame = async () => {
            const response = await handleInitGame();
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }

            if (response === "alreadyStarted" && playerName) {
                const lastState = await handlePushCallback(
                    Callback.restoreState,
                    {},
                );
                if (lastState === undefined) {
                    dispatch({ type: "changeScreen", screen: Screen.Error });
                    return;
                }

                if (lastState.rules.state === "initialized") {
                    dispatch({ type: "changeScreen", screen: Screen.Welcome });
                    return;
                }
                if (lastState.rules.state === "in_game") {
                    unstable_batchedUpdates(() => {
                        dispatch({
                            type: "updateStateData",
                            stateData: lastState,
                        });
                        dispatch({ type: "changeScreen", screen: Screen.Main });
                    });
                    return;
                }
                if (lastState.rules.state === "mugging") {
                    unstable_batchedUpdates(() => {
                        dispatch({
                            type: "updateStateData",
                            stateData: lastState,
                        });
                        dispatch({
                            type: "changeScreen",
                            screen: Screen.Mugging,
                        });
                    });
                }
            } else {
                dispatch({ type: "changeScreen", screen: Screen.Welcome });
            }
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

function handleChangeScreen(state: GameState, nextScreen: Screen): GameState {
    return {
        ...state,
        currentScreen: nextScreen,
    };
}

function handleUpdateState(
    apiState: ApiState,
    currentState: GameState,
): GameState {
    const { currentScreen } = currentState;
    const {
        player: { player_name, funds, debt, weapon, pack, pack_space },
        station: { market, station_name },
        rules: { turns_left, state },
    } = apiState;

    return {
        currentProcess: state,
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
        spaceAvailable: pack_space - countPackUse(pack),
        market,
    };
}

function countPackUse(pack: Pack) {
    return Object.entries(pack).reduce((sum, [, amount]) => {
        return sum + amount;
    }, 0);
}
