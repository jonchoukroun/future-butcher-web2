import { Channel, Socket } from "phoenix";
import * as React from "react";

import { buyCut } from "./buyCut";
import { buyPack } from "./buyPack";
import { buyWeapon } from "./buyWeapon";
import { endGame } from "./endGame";
import { fightMugger } from "./fightMugger";
import { getScores } from "./getScores";
import { joinChannel } from "./joinChannel";
import { newGame } from "./newGame";
import { payDebt } from "./payDebt";
import { replaceWeapon } from "./replaceWeapon";
import { restoreState } from "./restoreState";
import { sellCut } from "./sellCut";
import { startGame } from "./startGame";
import { travel } from "./travel";
import {
    ApiErrorType,
    ApiStateType,
    CutType,
    HighScoresType,
    PackType,
    WeaponType,
} from "../GameData";
import { handleMessage, MessageLevel } from "../Logging/handleMessage";
import { bribeMugger } from "./bribeMugger";

const { createContext, useCallback, useContext, useEffect, useMemo, useState } =
    React;

export type CallbackType =
    | "newGame"
    | "startGame"
    | "restoreState"
    | "travel"
    | "bribeMugger"
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
          ) => Promise<ApiStateType | ApiErrorType | undefined>;
          handleEndGame: (
              hashId: string,
              score: number,
          ) => Promise<HighScoresType | undefined>;
          handleGetScores: () => Promise<HighScoresType | void>;
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
    const [isConnected, setIsConnected] = useState(socket.isConnected());
    socket.onOpen(() => {
        handleMessage("Successfully opened socket", MessageLevel.Success);
        setIsConnected(socket.isConnected());
    });
    socket.onError(() => {
        handleMessage("Failed to open socket", MessageLevel.Error);
        setIsConnected(socket.isConnected());
    });
    socket.onClose(() => {
        handleMessage("Closed socket", MessageLevel.Info);
        setIsConnected(socket.isConnected());
    });

    useEffect(() => {
        if (socket.isConnected() || socket.connectionState() === "connecting") {
            return;
        }

        socket.connect();
    }, [isConnected, socket]);

    const [channel, setChannel] = useState<Channel | undefined>(undefined);

    const [didJoinChannel, setDidJoinChannel] = useState(
        channel === undefined ? false : channel.state === "joined",
    );
    const handleJoinChannel = useCallback(
        async (playerName: string, playerHash?: string) => {
            if (socket === undefined || !socket.isConnected()) return;
            if (
                channel !== undefined &&
                (channel.state === "joined" || channel.state === "joining")
            ) {
                return;
            }

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
        [channel, socket],
    );

    const handleInitGame = useCallback(async () => {
        if (channel === undefined) return;
        return await newGame(channel);
    }, [channel]);

    const handlePushCallback = useCallback(
        async (callback: CallbackType, payload: Record<string, unknown>) => {
            if (channel === undefined) return;

            let response: Promise<ApiStateType | ApiErrorType | undefined>;
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

                case "bribeMugger":
                    response = bribeMugger(channel, payload);
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

                case "replaceWeapon":
                    response = replaceWeapon(
                        channel,
                        payload as { weapon: WeaponType },
                    );
                    break;

                default:
                    throw new Error(`Unhandled callback ${callback}`);
            }
            return await response;
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
