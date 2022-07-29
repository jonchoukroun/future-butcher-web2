import { Channel } from "phoenix";
import { ApiStateType } from "../GameData";

export async function startGame(channel: Channel): Promise<ApiStateType> {
    return new Promise((resolve, reject) => {
        channel
            .push("start_game", {})
            .receive("ok", ({ state_data }: { state_data: ApiStateType }) => {
                resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                reject(reason);
            });
    });
}
