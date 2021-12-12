import { Channel, Socket } from "phoenix";
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useGameState } from "./GameStateProvider";
import { getScores } from "./getScores";
import { joinChannel } from "./joinChannel";

const { createContext, useCallback, useContext, useEffect, useState } = React;

const API_URL = "ws://localhost:5000/socket";

const ChannelContext = createContext<
    | {
          handleJoinChannel: (playerName: string) => Promise<void>;
          handleGetScores: () => Promise<
              { player: string; score: number }[] | void
          >;
      }
    | undefined
>(undefined);

export const ChannelProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [socket] = useState<Socket>(new Socket(API_URL, {}));
    useEffect(() => {
        if (socket.isConnected()) return;
        socket.onOpen(() => {
            console.log("Successfully opened socket");
        });
        socket.onError(() => {
            console.error("Failed to open socket");
        });
        socket.onClose(() => {
            console.log("Closed socket");
        });
        socket.connect();
    }, [socket]);

    const [channel, setChannel] = useState<Channel | undefined>(undefined);

    const { dispatch } = useGameState();
    const handleJoinChannel = useCallback(
        async (playerName: string) => {
            if (socket === undefined || !socket.isConnected()) return;

            const response = await joinChannel(playerName, socket);
            unstable_batchedUpdates(() => {
                dispatch({ type: "updateChannelStatus", isConnected: true });
                setChannel(response);
            });
        },
        [socket],
    );

    const handleGetScores = useCallback(async () => {
        if (channel === undefined) return;

        return await getScores(channel);
    }, [channel]);

    const value = {
        handleJoinChannel,
        handleGetScores,
    };

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
