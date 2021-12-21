import { Channel } from "phoenix";
import { ApiState } from "./";

export async function fightMugger(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("fight_mugger", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
