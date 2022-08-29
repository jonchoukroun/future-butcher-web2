import { Channel } from "phoenix";
import { PackType, ApiStateType, ApiErrorType } from "../GameData";

export async function buyPack(
    channel: Channel,
    payload: { pack: PackType },
): Promise<ApiStateType | ApiErrorType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_pack", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                const handledErrors = [
                    ":insufficient_cash",
                    ":must_upgrade_pack",
                ];
                if (handledErrors.includes(reason)) {
                    return resolve({ error: reason });
                }

                return reject(reason);
            });
    });
}
