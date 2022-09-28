import { Channel } from "phoenix";

export async function endGame(
    channel: Channel,
    payload: { playerName: string },
): Promise<{ player: string; score: number }[]> {
    return new Promise((resolve, reject) => {
        channel
            .push("end_game", { player_name: payload.playerName })
            .receive("ok", ({ state_data }) => {
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                reject(reason);
            });
    });
}
