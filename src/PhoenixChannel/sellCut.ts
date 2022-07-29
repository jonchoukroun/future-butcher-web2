import { Channel } from "phoenix";
import { CutType, ApiStateType } from "../GameData";

export async function sellCut(
    channel: Channel,
    payload: { cut: CutType; amount: number },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("sell_cut", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
