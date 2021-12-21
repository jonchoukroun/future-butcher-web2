import { Channel, Socket } from "phoenix";

import { handleMessage } from "../Logging/handleMessage";

export async function joinChannel({
    playerName,
    playerHash,
    socket,
}: {
    playerName: string;
    playerHash?: string;
    socket: Socket;
}): Promise<Channel | "join crashed" | undefined> {
    const payload: { player_name: string; hash_id?: string } = {
        player_name: playerName,
    };
    if (playerHash) payload.hash_id = playerHash;
    const channel = socket.channel(`game:${playerName}`, payload);

    return new Promise((resolve, reject) => {
        channel
            .join()
            .receive("ok", ({ hash_id }) => {
                localStorage.setItem("playerName", playerName);
                localStorage.setItem("playerHash", hash_id);
                handleMessage("Channel joined successfully", "success");
                return resolve(channel);
            })
            .receive("error", ({ reason }) => {
                if (reason === "join crashed") return resolve(reason);

                handleMessage(`Failed to join channel: ${reason}`, "error");
                return reject(undefined);
            });
    });
}
