import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";

import {
    ApiStateType,
    GameStateType,
    HighScoresType,
    OwnedCutsType,
    ScreenType,
} from ".";
import { serializeMarket, serializeStore } from "./Serializers";
import { muggerNames } from "../Fixtures/mugging";
import { StationKey } from "../Fixtures/subwayStations";
import { useChannel, Callback } from "../PhoenixChannel/ChannelProvider";

type Action =
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: ScreenType }
    | { type: "updateStateData"; stateData: ApiStateType }
    | { type: "setHighScores"; highScores: HighScoresType }
    | { type: "shuffleMuggers" }
    | { type: "killMugger" };

const GameStateContext = React.createContext<
    { state: GameStateType; dispatch: (action: Action) => void } | undefined
>(undefined);

function gameStateReducer(state: GameStateType, action: Action) {
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

        dispatch({ type: "changeScreen", screen: "error" });
    }, [isDisconnected]);

    useEffect(() => {
        const handleJoin = async () => {
            if (!playerName || !playerHash) {
                dispatch({ type: "changeScreen", screen: "login" });
                return;
            }
            const reply = await handleJoinChannel(playerName, playerHash);
            if (reply === "join crashed") {
                dispatch({ type: "changeScreen", screen: "login" });
            }
            dispatch({ type: "shuffleMuggers" });
        };
        if (isConnected) handleJoin();
    }, [isConnected]);

    useEffect(() => {
        const initGame = async () => {
            const response = await handleInitGame();
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: "error" });
                return;
            }

            if (response === "alreadyStarted" && playerName) {
                const lastState = await handlePushCallback(
                    Callback.restoreState,
                    {},
                );
                if (lastState === undefined) {
                    dispatch({ type: "changeScreen", screen: "error" });
                    return;
                }

                if (lastState.rules.state === "initialized") {
                    dispatch({ type: "changeScreen", screen: "welcome" });
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
                                    ? "store"
                                    : "market",
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
                            screen: "mugging",
                        });
                    });
                }
            } else {
                dispatch({ type: "changeScreen", screen: "welcome" });
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

function handleChangeScreen(
    state: GameStateType,
    nextScreen: ScreenType,
): GameStateType {
    return {
        ...state,
        currentScreen: nextScreen,
    };
}

function handleUpdateState(
    apiState: ApiStateType,
    currentState: GameStateType,
): GameStateType {
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
        market: market ? serializeMarket(market) : undefined,
        muggers,
        player: {
            debt,
            funds,
            health: 100,
            playerName: player_name,
            pack,
            totalPackSpace: pack_space,
            weapon,
        },
        store: store ? serializeStore(store) : undefined,
        turnsLeft: turns_left,
    };
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
