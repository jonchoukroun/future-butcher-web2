import { Channel } from "phoenix";
import { handleMessage } from "../Logging/handleMessage";

export async function newGame(
    channel: Channel,
): Promise<"ok" | "alreadyStarted"> {
    return new Promise((resolve, reject) => {
        channel
            .push("new_game", {})
            .receive("ok", ({ state_data }) => {
                if (state_data !== "ok") {
                    handleMessage(
                        "Invalid state data response to push: 'new_game'",
                        "error",
                    );
                }
                resolve(state_data);
            })
            .receive("error", ({ reason }: { reason: string }) => {
                if (reason.includes(":already_started")) {
                    resolve("alreadyStarted");
                }
                reject(reason);
            });
    });
}
