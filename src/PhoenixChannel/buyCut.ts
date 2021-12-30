import { Channel } from "phoenix";

export async function buyCut(
    channel: Channel,
    payload: { cut: CutName; amount: number },
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_cut", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
