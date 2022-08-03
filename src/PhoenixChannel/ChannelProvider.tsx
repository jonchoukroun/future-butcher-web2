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
import { useAlertService } from "../AlertService/AlertServiceProvider";
import {
    ApiErrorType,
    ApiStateType,
    CutType,
    HighScoresType,
    PackType,
    WeaponType,
} from "../GameData";
import { handleMessage, MessageLevel } from "../Logging/handleMessage";

const { createContext, useCallback, useContext, useMemo, useEffect, useState } =
    React;

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
          ) => Promise<ApiStateType | ApiErrorType | undefined>;
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

    const { pushAlert } = useAlertService();

    const [socket] = useState<Socket>(new Socket(apiUrl, {}));
    const [isConnected, setIsConnected] = useState(false);
    const [isDisconnected, setIsDisconnected] = useState(false);

    useEffect(() => {
        if (socket.isConnected()) return;

        socket.onOpen(() => {
            handleMessage("Successfully opened socket", MessageLevel.Success);
            setIsConnected(true);
        });
        socket.onError(() => {
            handleMessage("Failed to open socket", MessageLevel.Error);
            setIsConnected(false);
            setIsDisconnected(true);
        });
        socket.onClose(() => {
            handleMessage("Closed socket", MessageLevel.Info);
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

            let response: Promise<ApiStateType | ApiErrorType | undefined>;
            switch (callback) {
                case "startGame":
                    response = startGame(channel);
                    pushAlert({
                        text: START_GAME_ALERT_1,
                        isPersistent: true,
                    });
                    pushAlert({
                        text: START_GAME_ALERT_2,
                        isPersistent: true,
                    });
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

                case "replaceWeapon":
                    response = replaceWeapon(
                        channel,
                        payload as { weapon: WeaponType },
                    );
                    break;

                default:
                    throw new Error(`Unhandled callback ${callback}`);
            }
            const x = await response;
            console.log("!!handleCallback", callback, x);
            return x;
        },
        [channel, pushAlert],
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

const START_GAME_ALERT_1 =
    "You hit the Meat Market in Compton. Prices are usually lower here, especially for Ribs.";

const START_GAME_ALERT_2 =
    "Keep an eye on the clock up top. It's 5:00am now, and you only have 24 hours.";
