import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";

import { muggerNames } from "../Fixtures/mugging";
import { useChannel, Callback } from "../PhoenixChannel/ChannelProvider";
import { StationKey } from "../Fixtures/subwayStations";

export enum Screen {
    Login = "Login",
    Welcome = "Future Butcher",
    // Main = "Main",
    Subway = "Subway",
    Market = "Market",
    SurplusStore = "Gus's Army Surplus",
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

export type GameProcess = "initialized" | "in_game" | "mugging" | "game_over";

type HighScores = { player: string; score: number }[];

type GameState = {
    currentProcess?: GameProcess;
    currentScreen?: Screen;
    currentStation?: string;
    highScores?: HighScores;
    market?: Market;
    muggers?: string[];
    pack?: Pack;
    player?: Player;
    spaceAvailable?: number;
    store?: Store;
    turnsLeft?: number;
};
type Action =
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: Screen }
    | { type: "updateStateData"; stateData: ApiState }
    | { type: "setHighScores"; highScores: HighScores }
    | { type: "shuffleMuggers" }
    | { type: "killMugger" };

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

        case "shuffleMuggers":
            return { ...state, muggers: shuffleMuggerNames() };

        case "killMugger":
            if (state.muggers === undefined) {
                throw new Error("State is undefined");
            }
            state.muggers.shift();
            return state;

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
            dispatch({ type: "shuffleMuggers" });
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
                    dispatch({ type: "changeScreen", screen: Screen.Error });
                    return;
                }
                if (lastState.rules.state === "in_game") {
                    unstable_batchedUpdates(() => {
                        dispatch({
                            type: "updateStateData",
                            stateData: lastState,
                        });
                        dispatch({
                            type: "changeScreen",
                            screen:
                                lastState.station.station_name ===
                                StationKey.bellGardens
                                    ? Screen.SurplusStore
                                    : Screen.Market,
                        });
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
    const { currentScreen, muggers } = currentState;
    const {
        player: { player_name, funds, debt, weapon, pack, pack_space },
        station: { market, station_name, store },
        rules: { turns_left, state },
    } = apiState;

    return {
        currentProcess: state,
        currentScreen,
        currentStation: station_name,
        market: market ? market : undefined,
        muggers,
        pack,
        player: {
            playerName: player_name,
            health: 100,
            funds,
            debt,
            weapon,
            packSpace: pack_space,
        },
        store: store ? store : undefined,
        spaceAvailable: pack_space - countPackUse(pack),
        turnsLeft: turns_left,
    };
}

function countPackUse(pack: Pack) {
    return Object.entries(pack).reduce((sum, [, amount]) => {
        return sum + amount;
    }, 0);
}

function shuffleMuggerNames() {
    let currIdx = muggerNames.length,
        rndIdx;

    while (currIdx !== 0) {
        rndIdx = Math.floor(Math.random() * currIdx);
        currIdx--;
        [muggerNames[currIdx], muggerNames[rndIdx]] = [
            muggerNames[rndIdx],
            muggerNames[currIdx],
        ];
    }

    return muggerNames;
}
