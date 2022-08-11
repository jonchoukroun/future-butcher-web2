import { captureMessage } from "@sentry/react";
export const enum MessageLevel {
    Success,
    Info,
    Error,
}
type MessageLevelType = typeof MessageLevel[keyof typeof MessageLevel];

export function handleMessage(
    message: string,
    level: MessageLevelType = MessageLevel.Info,
) {
    if (process.env.NODE_ENV === "production" && level === MessageLevel.Error) {
        captureMessage(message, "error");
        return;
    }

    switch (level) {
        case MessageLevel.Success:
            console.log(message);
            captureMessage(message, "info");
            break;
        case MessageLevel.Info:
            console.info(message);
            captureMessage(message, "warning");
            break;
        case MessageLevel.Error:
            console.error(message);
            captureMessage(message, "error");
            break;
        default:
            throw new Error("Invalid message handler level");
    }
}
