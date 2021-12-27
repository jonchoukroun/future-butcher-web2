import { Channel } from "phoenix";

export async function dropPack(
    channel: Channel,
    payload: { pack: PackName },
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("drop_pack", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
