import { Channel } from "phoenix";
import { ApiState } from ".";

export async function restoreState(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | string> {
    const { name } = payload;
    return new Promise((resolve, reject) => {
        channel
            .push("restore_game_state", { name })
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!restore_game_state | ok", state_data);
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!restore_game_state | error", reason);
                if (JSON.parse(reason) === "No existing process") {
                    return resolve("noExistingProcess");
                }
                reject(reason);
            });
    });
}
