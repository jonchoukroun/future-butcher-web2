import { Channel } from "phoenix";

export async function endGame(
    channel: Channel,
    payload: { hashId: string; score: number },
): Promise<{ player: string; score: number }[]> {
    return new Promise((resolve, reject) => {
        channel
            .push("end_game", { hash_id: payload.hashId, score: payload.score })
            .receive("ok", ({ state_data }) => {
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                reject(reason);
            });
    });
}
