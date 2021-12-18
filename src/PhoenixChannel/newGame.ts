import { Channel } from "phoenix";

export async function newGame(
    channel: Channel,
): Promise<"ok" | "alreadyStarted"> {
    return new Promise((resolve, reject) => {
        channel
            .push("new_game", {})
            .receive("ok", ({ state_data }) => {
                if (state_data !== "ok") throw new Error("Invalid response");
                console.log("!!new_game | ok");
                resolve(state_data);
            })
            .receive("error", ({ reason }: { reason: string }) => {
                if (reason.includes(":already_started")) {
                    console.log("!!new_game | error", reason);
                    resolve("alreadyStarted");
                }
                reject(reason);
            });
    });
}
