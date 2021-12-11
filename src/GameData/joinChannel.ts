import { Channel, Socket } from "phoenix";

export async function joinChannel(
    playerName: string,
    socket: Socket,
): Promise<Channel | undefined> {
    const payload: { player_name: string; hash_id?: string } = {
        player_name: playerName,
    };
    const hashId = localStorage.getItem("hashId");
    if (hashId) payload.hash_id = hashId;
    const channel = socket.channel(`game:${playerName}`, payload);
    return new Promise((resolve, reject) => {
        channel
            .join()
            .receive("ok", ({ hash_id }) => {
                console.log("Channel joined successfully");
                localStorage.setItem("playerHash", hash_id);
                resolve(channel);
            })
            .receive("error", (reason) => {
                console.error("Failed to join channel", reason);
                reject(undefined);
            });
    });
}
