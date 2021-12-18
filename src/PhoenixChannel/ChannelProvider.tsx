import { Channel, Socket } from "phoenix";
import * as React from "react";

import { ApiState } from ".";
import { endGame } from "./endGame";
import { getScores } from "./getScores";
import { joinChannel } from "./joinChannel";
import { newGame } from "./newGame";
import { restoreState } from "./restoreState";
import { startGame } from "./startGame";
import { travel } from "./travel";
import { fightMugger } from "./fightMugger";

const {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} = React;

export const enum Callback {
    newGame,
    startGame,
    restoreState,
    travel,
    fightMugger,
}

const ChannelContext = createContext<
    | {
          didJoinChannel: boolean;
          handleInitGame: () => Promise<"ok" | "alreadyStarted" | undefined>;
          handleJoinChannel: (
              playerName: string,
              playerHash?: string,
          ) => Promise<Channel | undefined>;
          handlePushCallback: (
              callback: Callback,
              payload: Record<string, unknown>,
          ) => Promise<ApiState | undefined>;
          handleEndGame: (
              hashId: string,
              score: number,
          ) => Promise<{ player: string; score: number }[] | undefined>;
          handleGetScores: () => Promise<
              { player: string; score: number }[] | void
          >;
          isConnected: boolean;
      }
    | undefined
>(undefined);

export const ChannelProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw new Error("API URL is not defined");

    const [socket] = useState<Socket>(new Socket(apiUrl, {}));
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (socket.isConnected()) return;
        socket.onOpen(() => {
            console.log("Successfully opened socket");
            setIsConnected(true);
        });
        socket.onError(() => {
            console.error("Failed to open socket");
            setIsConnected(false);
        });
        socket.onClose(() => {
            console.log("Closed socket");
            setIsConnected(false);
        });
        socket.connect();
    }, [socket]);

    const [channel, setChannel] = useState<Channel | undefined>(undefined);

    const [didJoinChannel, setDidJoinChannel] = useState(false);
    const handleJoinChannel = useCallback(
        async (playerName: string, playerHash?: string) => {
            if (socket === undefined || !socket.isConnected()) return;

            const response = await joinChannel({
                playerName,
                playerHash,
                socket,
            });
            setChannel(response);
            if (response !== undefined) setDidJoinChannel(true);
            return response;
        },
        [socket],
    );

    const handleInitGame = useCallback(async () => {
        if (channel === undefined) return;
        return await newGame(channel);
    }, [channel]);

    const handlePushCallback = useCallback(
        async (callback: Callback, payload: Record<string, unknown>) => {
            console.log("!!handlePushCallback", callback, channel);
            if (channel === undefined) return;

            switch (callback) {
                case Callback.startGame:
                    return await startGame(channel);

                case Callback.restoreState:
                    const name = localStorage.getItem("playerName");
                    if (!name) {
                        throw new Error(
                            "Cannot restore state without a player name",
                        );
                    }
                    return await restoreState(channel, name);

                case Callback.travel:
                    return await travel(channel, payload);

                case Callback.fightMugger:
                    return await fightMugger(channel, payload);

                default:
                    console.log("!!payload", payload);
                    throw new Error(`Unhandled callback ${callback}`);
            }
        },
        [channel],
    );

    const handleEndGame = useCallback(
        async (hashId: string, score: number) => {
            if (channel === undefined) return;

            const highScores = await endGame(channel, { hashId, score });
            console.log("!!highScores", highScores);
            return highScores;
        },
        [channel],
    );

    const handleGetScores = useCallback(async () => {
        if (channel === undefined) return;

        return await getScores(channel);
    }, [channel]);

    const value = useMemo(
        () => ({
            didJoinChannel,
            handleInitGame,
            handleJoinChannel,
            handlePushCallback,
            handleEndGame,
            handleGetScores,
            isConnected,
        }),
        [
            didJoinChannel,
            handleInitGame,
            handleJoinChannel,
            handlePushCallback,
            handleEndGame,
            handleGetScores,
            isConnected,
        ],
    );

    return (
        <ChannelContext.Provider value={value}>
            {children}
        </ChannelContext.Provider>
    );
};

export function useChannel() {
    const context = useContext(ChannelContext);
    if (context === undefined)
        throw new Error("useChannel must be used within ChannelContext");

    return context;
}
