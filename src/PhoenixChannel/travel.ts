import { Channel } from "phoenix";
import { ApiStateType } from "../GameData";

export async function travel(
    channel: Channel,
    payload: { destination: string },
): Promise<ApiStateType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("change_station", payload)
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
