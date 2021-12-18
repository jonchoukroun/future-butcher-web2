import { Channel } from "phoenix";
import { ApiState } from ".";

export async function travel(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    const { station } = payload;
    return new Promise((resolve, reject) => {
        channel
            .push("change_station", { destination: station })
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!change_station | ok", state_data);
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!change_station | error", reason);
                return reject(reason);
            });
    });
}
