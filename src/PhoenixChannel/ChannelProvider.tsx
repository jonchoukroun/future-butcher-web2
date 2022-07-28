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
import { replaceWeapon } from "./replaceWeapon";
import { restoreState } from "./restoreState";
import { startGame } from "./startGame";
import { travel } from "./travel";
import { sellCut } from "./sellCut";
import { handleMessage } from "../Logging/handleMessage";
import { buyWeapon } from "./buyWeapon";

const {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} = React;

export enum Callback {
    newGame = "newGame",
    startGame = "startGame",
    restoreState = "restoreState",
    travel = "travel",
    fightMugger = "fightMugger",
    buyCut = "buyCut",
    sellCut = "sellCut",
    buyPack = "buyPack",
    buyWeapon = "buyWeapon",
    replaceWeapon = "replaceWeapon",
    payDebt = "payDebt",
    endGame = "endGame",
}

const ChannelContext = createContext<
    | {
          didJoinChannel: boolean;
          handleInitGame: () => Promise<"ok" | "alreadyStarted" | undefined>;
          handleJoinChannel: (
              playerName: string,
              playerHash?: string,
          ) => Promise<Channel | string | undefined>;
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
        async (callback: Callback, payload: Record<string, unknown>) => {
            if (channel === undefined) return;

            let response: Promise<ApiState | undefined>;
            switch (callback) {
                case Callback.startGame:
                    response = startGame(channel);
                    break;

                case Callback.restoreState:
                    const name = localStorage.getItem("playerName");
                    if (!name) {
                        setChannel(undefined);
                        return;
                    }
                    response = restoreState(channel, name);
                    break;

                case Callback.travel:
                    response = travel(
                        channel,
                        payload as { destination: string },
                    );
                    break;

                case Callback.fightMugger:
                    response = fightMugger(channel, payload);
                    break;

                case Callback.buyCut:
                    response = buyCut(
                        channel,
                        payload as {
                            cut: CutName;
                            amount: number;
                        },
                    );
                    break;

                case Callback.sellCut:
                    response = sellCut(
                        channel,
                        payload as {
                            cut: CutName;
                            amount: number;
                        },
                    );
                    break;

                case Callback.payDebt:
                    response = payDebt(channel, payload);
                    break;

                case Callback.buyPack:
                    response = buyPack(channel, payload as { pack: PackName });
                    break;

                case Callback.buyWeapon:
                    response = buyWeapon(
                        channel,
                        payload as { weapon: WeaponName },
                    );
                    break;

                case Callback.replaceWeapon:
                    response = replaceWeapon(
                        channel,
                        payload as { weapon: WeaponName },
                    );
                    break;

                default:
                    throw new Error(`Unhandled callback ${callback}`);
            }
            const x = await response;
            console.log("!!handleCallback", Callback[callback], x);
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
