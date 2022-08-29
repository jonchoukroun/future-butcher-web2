import { Channel } from "phoenix";
import { ApiErrorType, ApiStateType, WeaponType } from "../GameData";

export async function buyWeapon(
    channel: Channel,
    payload: { weapon: WeaponType },
): Promise<ApiStateType | ApiErrorType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                const handledErrors = [
                    ":insufficient_cash",
                    ":already_owns_weapon",
                ];
                if (handledErrors.includes(reason)) {
                    return resolve({ error: reason });
                }

                return reject(reason);
            });
    });
}
