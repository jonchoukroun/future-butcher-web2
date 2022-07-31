import { Channel } from "phoenix";
import { WeaponType, ApiStateType, ApiErrorType } from "../GameData";

export async function replaceWeapon(
    channel: Channel,
    payload: { weapon: WeaponType },
): Promise<ApiStateType | ApiErrorType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("replace_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                const handledErrors = [
                    ":insufficient_funds",
                    ":same_weapon_type",
                ];
                if (handledErrors.includes(reason)) {
                    return resolve({ error: reason });
                }

                return reject(reason);
            });
    });
}
