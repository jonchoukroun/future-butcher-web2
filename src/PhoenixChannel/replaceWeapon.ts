import { Channel } from "phoenix";

export async function replaceWeapon(
    channel: Channel,
    payload: { weapon: WeaponName },
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("replace_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
