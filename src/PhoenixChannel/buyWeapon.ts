import { Channel } from "phoenix";

export async function buyWeapon(
    channel: Channel,
    payload: { weapon: WeaponName },
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("buy_weapon", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
