import { Channel } from "phoenix";

export async function endGame(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<{ player: string; score: number }[]> {
    const { hashId, score } = payload;
    if (hashId === undefined || score === undefined) {
        throw new Error("Invalid payload");
    }
    return new Promise((resolve, reject) => {
        channel
            .push("end_game", payload)
            .receive("ok", ({ state_data }) => {
                console.log("!!end_game | ok", state_data);
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!end_game | error", reason);
                reject(reason);
            });
    });
}
