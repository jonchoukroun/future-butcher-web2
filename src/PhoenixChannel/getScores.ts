import { Channel } from "phoenix";

export async function getScores(
    channel: Channel,
): Promise<{ player: string; score: number }[] | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("get_scores", {})
            .receive("ok", ({ state_data }) => {
                console.log("Successfully fetched scores", state_data);
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                console.error("Failed to fetch scores", reason);
                return reject(reason);
            });
    });
}
