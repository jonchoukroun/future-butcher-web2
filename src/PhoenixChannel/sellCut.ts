import { Channel } from "phoenix";
import { ApiState } from ".";

export async function sellCut(
    channel: Channel,
    payload: Record<string, unknown>,
): Promise<ApiState | undefined> {
    const { cut, amount } = payload;
    if (typeof cut !== "string" || typeof amount !== "number") {
        throw new Error("Invalid payload for sellCut");
    }

    return new Promise((resolve, reject) => {
        channel
            .push("sell_cut", payload)
            .receive("ok", ({ state_data }: { state_data: ApiState }) => {
                console.log("!!sell_cut | ok", state_data);
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.log("!!sell_cut | error", reason);
                return reject(reason);
            });
    });
}
