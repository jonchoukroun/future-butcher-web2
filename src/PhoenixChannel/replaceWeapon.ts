import { Channel } from "phoenix";
import { WeaponType, ApiStateType } from "../GameData";

export async function replaceWeapon(
    channel: Channel,
    payload: { weapon: WeaponType },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("replace_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
