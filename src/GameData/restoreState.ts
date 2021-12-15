import { Channel } from "phoenix";
import { ApiState } from ".";

export async function restoreState(
    channel: Channel,
    name: string,
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            // eslint-disable-next-line @typescript-eslint/ban-types
            .push("restore_game_state", (name as unknown) as object)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!restore_game_state | ok", state_data);
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!restore_game_state | error", reason);
                if (JSON.parse(reason) === "No existing process") {
                    return resolve(undefined);
                }
                reject(reason);
            });
    });
}
