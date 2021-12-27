import { Channel } from "phoenix";

export async function payDebt(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("pay_debt", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
