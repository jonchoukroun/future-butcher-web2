import { Channel } from "phoenix";
import { ApiStateType, WeaponType } from "../GameData";

export async function buyWeapon(
    channel: Channel,
    payload: { weapon: WeaponType },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
