type MessageLevel = "success" | "info" | "error";

export function handleMessage(message: string, level: MessageLevel = "info") {
    // TODO: implement Sentry
    if (process.env.NODE_ENV === "production") return;

    switch (level) {
        case "success":
            console.log(message);
            break;
        case "info":
            console.info(message);
            break;
        case "error":
            console.error(message);
            break;
        default:
            throw new Error("Invalid message handler level");
    }
}
