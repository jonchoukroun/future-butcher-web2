import { Channel } from "phoenix";
import { ApiStateType } from "../GameData";

export async function payDebt(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("pay_debt", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
