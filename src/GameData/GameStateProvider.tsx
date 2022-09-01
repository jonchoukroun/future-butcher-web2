import * as React from "react";

import {
    ApiStateType,
    GameStateType,
    HighScoresType,
    Screen,
    ScreenType,
} from "./";
import { serializeMarket, serializeStore } from "./Serializers";
import { isApiError } from "./State";
import { muggerNames } from "../Fixtures/mugging";
import { useChannel } from "../PhoenixChannel/ChannelProvider";
import { WelcomeScreen } from "../Screens/Welcome/Welcome";

type Action =
    | { type: "updateChannelStatus"; isConnected: boolean }
    | { type: "changeScreen"; screen: ScreenType; screenProps?: WelcomeScreen }
    | { type: "updateStateData"; stateData: ApiStateType }
    | { type: "setHighScores"; highScores: HighScoresType }
    | { type: "shuffleMuggers" }
    | { type: "killMugger" }
    | { type: "setUnseenAlerts" }
    | { type: "clearAlerts" };

const GameStateContext = React.createContext<
    { state: GameStateType; dispatch: (action: Action) => void } | undefined
>(undefined);

function gameStateReducer(state: GameStateType, action: Action) {
    switch (action.type) {
        case "changeScreen":
            return handleChangeScreen(state, action.screen, action.screenProps);

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

        case "setUnseenAlerts":
            return { ...state, hasUnseenAlerts: true };

        case "clearAlerts":
            return { ...state, hasUnseenAlerts: false };

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
        handleEndGame,
        handleInitGame,
        handleJoinChannel,
        handlePushCallback,
        isConnected,
    } = useChannel();

    const playerName = localStorage.getItem("playerName");
    const playerHash = localStorage.getItem("playerHash");

    const [state, dispatch] = React.useReducer(gameStateReducer, {});

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
    }, [handleJoinChannel, isConnected, playerHash, playerName]);

    const isInGameRef = React.useRef(false);
    useEffect(() => {
        if (isInGameRef.current) return;

        const initGame = async () => {
            const response = await handleInitGame();
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }

            if (response === "alreadyStarted" && playerName) {
                const lastState = await handlePushCallback("restoreState", {});
                if (lastState === undefined) {
                    dispatch({ type: "changeScreen", screen: Screen.Error });
                    return;
                }

                // TODO: API error handling
                if (isApiError(lastState)) {
                    return lastState;
                }

                if (lastState.rules.state === "initialized") {
                    dispatch({ type: "changeScreen", screen: Screen.Welcome });
                    return;
                }
                if (lastState.rules.state === "in_game") {
                    if (lastState.player.health < 0) {
                        handleEndGame(playerHash || "", 0);
                        return;
                    }
                    isInGameRef.current = true;
                    dispatch({ type: "updateStateData", stateData: lastState });
                    let screen: ScreenType;
                    if (lastState.station.station_name === "bell_gardens") {
                        screen = Screen.Store;
                    } else if (
                        lastState.station.station_name === "venice_beach"
                    ) {
                        screen = Screen.Clinic;
                    } else {
                        screen = Screen.Market;
                    }
                    dispatch({
                        type: "changeScreen",
                        screen,
                    });
                    return;
                }
                if (lastState.rules.state === "mugging") {
                    dispatch({ type: "updateStateData", stateData: lastState });
                    dispatch({
                        type: "changeScreen",
                        screen: Screen.Mugging,
                    });
                }
            } else {
                dispatch({ type: "changeScreen", screen: Screen.Welcome });
            }
        };
        if (didJoinChannel) initGame();
    }, [
        didJoinChannel,
        handleEndGame,
        handleInitGame,
        handlePushCallback,
        playerHash,
        playerName,
    ]);

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
    screenProps?: WelcomeScreen,
): GameStateType {
    return {
        ...state,
        currentScreen: nextScreen,
        screenProps,
    };
}

function handleUpdateState(
    apiState: ApiStateType,
    currentState: GameStateType,
): GameStateType {
    const { currentScreen, muggers } = currentState;
    const {
        player: { player_name, cash, debt, health, weapon, pack, pack_space },
        station: { clinic_cost, market, station_name, store },
        rules: { turns_left, state },
    } = apiState;
    return {
        currentProcess: state,
        currentScreen,
        currentStation: station_name,
        market: market ? serializeMarket(market) : undefined,
        muggers,
        player: {
            cash,
            debt,
            health,
            playerName: player_name,
            pack,
            totalPackSpace: pack_space,
            weapon,
        },
        store: store ? serializeStore(store) : undefined,
        clinicCost: clinic_cost ? clinic_cost : undefined,
        turnsLeft: turns_left,
        hasUnseenAlerts: true,
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
