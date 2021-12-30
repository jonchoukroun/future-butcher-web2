import { Channel } from "phoenix";

export async function travel(
    channel: Channel,
    payload: { destination: string },
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("change_station", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
