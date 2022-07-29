import { Channel, Socket } from "phoenix";
import * as React from "react";

import { buyCut } from "./buyCut";
import { buyPack } from "./buyPack";
import { endGame } from "./endGame";
import { fightMugger } from "./fightMugger";
import { getScores } from "./getScores";
import { joinChannel } from "./joinChannel";
import { newGame } from "./newGame";
import { payDebt } from "./payDebt";
// import { replaceWeapon } from "./replaceWeapon";
import { restoreState } from "./restoreState";
import { startGame } from "./startGame";
import { travel } from "./travel";
import { sellCut } from "./sellCut";
import { handleMessage } from "../Logging/handleMessage";
import { buyWeapon } from "./buyWeapon";
import {
    ApiStateType,
    CutType,
    HighScoresType,
    PackType,
    WeaponType,
} from "../GameData";

const { createContext, useCallback, useContext, useMemo, useEffect, useState } =
    React;

// FIXME: create enum for stable lookups
export type CallbackType =
    | "newGame"
    | "startGame"
    | "restoreState"
    | "travel"
    | "fightMugger"
    | "buyCut"
    | "sellCut"
    | "buyPack"
    | "buyWeapon"
    | "replaceWeapon"
    | "payDebt"
    | "endGame";

const ChannelContext = createContext<
    | {
          didJoinChannel: boolean;
          handleInitGame: () => Promise<"ok" | "alreadyStarted" | undefined>;
          handleJoinChannel: (
              playerName: string,
              playerHash?: string,
          ) => Promise<Channel | string | undefined>;
          handlePushCallback: (
              callback: CallbackType,
              payload: Record<string, unknown>,
          ) => Promise<ApiStateType | undefined>;
          handleEndGame: (
              hashId: string,
              score: number,
          ) => Promise<HighScoresType | undefined>;
          handleGetScores: () => Promise<HighScoresType | void>;
          isConnected: boolean;
          isDisconnected: boolean;
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
    const [isDisconnected, setIsDisconnected] = useState(false);

    useEffect(() => {
        if (socket.isConnected()) return;

        socket.onOpen(() => {
            handleMessage("Successfully opened socket", "success");
            setIsConnected(true);
        });
        socket.onError(() => {
            handleMessage("Failed to open socket", "error");
            setIsConnected(false);
            setIsDisconnected(true);
        });
        socket.onClose(() => {
            handleMessage("Closed socket", "info");
            setIsConnected(false);
            setIsDisconnected(true);
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
            if (response === "join crashed") {
                setChannel(undefined);
                return response;
            }
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
        async (callback: CallbackType, payload: Record<string, unknown>) => {
            if (channel === undefined) return;

            let response: Promise<ApiStateType | undefined>;
            switch (callback) {
                case "startGame":
                    response = startGame(channel);
                    break;

                case "restoreState":
                    const name = localStorage.getItem("playerName");
                    if (!name) {
                        setChannel(undefined);
                        return;
                    }
                    response = restoreState(channel, name);
                    break;

                case "travel":
                    response = travel(
                        channel,
                        payload as { destination: string },
                    );
                    break;

                case "fightMugger":
                    response = fightMugger(channel, payload);
                    break;

                case "buyCut":
                    response = buyCut(
                        channel,
                        payload as {
                            cut: CutType;
                            amount: number;
                        },
                    );
                    break;

                case "sellCut":
                    response = sellCut(
                        channel,
                        payload as {
                            cut: CutType;
                            amount: number;
                        },
                    );
                    break;

                case "payDebt":
                    response = payDebt(channel, payload);
                    break;

                case "buyPack":
                    response = buyPack(channel, payload as { pack: PackType });
                    break;

                case "buyWeapon":
                    response = buyWeapon(
                        channel,
                        payload as { weapon: WeaponType },
                    );
                    break;

                // TODO: consider for v2
                // case "replaceWeapon":
                //     response = replaceWeapon(
                //         channel,
                //         payload as { weapon: WeaponType },
                //     );
                //     break;

                default:
                    throw new Error(`Unhandled callback ${callback}`);
            }
            const x = await response;
            console.log("!!handleCallback", callback, x);
            return x;
        },
        [channel],
    );

    const handleEndGame = useCallback(
        async (hashId: string, score: number) => {
            if (channel === undefined) return;

            return await endGame(channel, { hashId, score });
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
            isDisconnected,
        }),
        [
            didJoinChannel,
            handleInitGame,
            handleJoinChannel,
            handlePushCallback,
            handleEndGame,
            handleGetScores,
            isConnected,
            isDisconnected,
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
