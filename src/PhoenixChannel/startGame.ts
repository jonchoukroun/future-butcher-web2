import { Channel } from "phoenix";

export async function startGame(channel: Channel): Promise<ApiState> {
    return new Promise((resolve, reject) => {
        channel
            .push("start_game", {})
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                reject(reason);
            });
    });
}
