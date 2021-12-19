import { Channel, Socket } from "phoenix";

export async function joinChannel({
    playerName,
    playerHash,
    socket,
}: {
    playerName: string;
    playerHash?: string;
    socket: Socket;
}): Promise<Channel | string | undefined> {
    const payload: { player_name: string; hash_id?: string } = {
        player_name: playerName,
    };
    if (playerHash) payload.hash_id = playerHash;

    const channel = socket.channel(`game:${playerName}`, payload);
    return new Promise((resolve, reject) => {
        channel
            .join()
            .receive("ok", ({ hash_id }) => {
                console.log("Channel joined successfully");
                localStorage.setItem("playerName", playerName);
                localStorage.setItem("playerHash", hash_id);
                return resolve(channel);
            })
            .receive("error", ({ reason }) => {
                console.error("Failed to join channel", reason);
                if (reason === "join crashed") {
                    return resolve(reason);
                }
                return reject(undefined);
            });
    });
}
