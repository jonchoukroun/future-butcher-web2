import { Channel } from "phoenix";
import { HighScoresType } from "./../GameData/State";

export async function getScores(
    channel: Channel,
): Promise<HighScoresType | undefined> {
    return new Promise((resolve, reject) => {
        channel
            .push("get_scores", {})
            .receive("ok", ({ state_data }) => {
                return resolve(state_data);
            })
            .receive("error", ({ reason }) => {
                return reject(reason);
            });
    });
}
