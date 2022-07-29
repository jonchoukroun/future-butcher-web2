import { Channel } from "phoenix";

import { CutType, ApiStateType } from "../GameData";

export async function buyCut(
    channel: Channel,
    payload: { cut: CutType; amount: number },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_cut", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
