import { Channel } from "phoenix";
import { ApiState } from ".";

export async function buyCut(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    const { cut, amount } = payload;
    if (typeof cut !== "string" || typeof amount !== "number") {
        throw new Error("Invalid payload for buyCut");
    }

    return new Promise((resolve, reject) => {
        channel
            .push("buy_cut", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!buy_cut | ok", state_data);
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!buy_cut | error", reason);
                return reject(reason);
            });
    });
}
