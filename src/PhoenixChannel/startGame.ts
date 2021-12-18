import { Channel } from "phoenix";
import { ApiState } from ".";

export async function startGame(channel: Channel): Promise<ApiState> {
    return new Promise((resolve, reject) => {
        channel
            .push("start_game", {})
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!start_game | ok", state_data);
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!start_game | error", reason);
                reject(reason);
            });
    });
}
