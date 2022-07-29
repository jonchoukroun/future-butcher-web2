import { Channel } from "phoenix";
import { PackType, ApiStateType } from "../GameData";

export async function buyPack(
    channel: Channel,
    payload: { pack: PackType },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_pack", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
