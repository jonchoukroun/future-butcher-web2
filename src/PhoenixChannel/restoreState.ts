import { Channel } from "phoenix";

export async function restoreState(
    channel: Channel,
    name: string,
): Promise<ApiState | undefined> {
    return new Promise((resolve, reject) => {
        channel
            // eslint-disable-next-line @typescript-eslint/ban-types
            .push("restore_game_state", name as unknown as object)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                if (JSON.parse(reason) === "No existing process") {
                    return resolve(undefined);
                }
                return reject(reason);
            });
    });
}
