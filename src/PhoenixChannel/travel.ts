import { Channel } from "phoenix";

export async function travel(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    const { station } = payload;
    return new Promise((resolve, reject) => {
        channel
            .push("change_station", { destination: station })
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
