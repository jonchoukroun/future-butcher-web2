import { Channel } from "phoenix";

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
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
