/** @jsx jsx */
import { jsx } from "@emotion/react";
import { createContext, useContext, useMemo, useState } from "react";

import { Alert } from "./Alert";

export type AlertType = {
    text: string;
    isPersistent: boolean;
};

type AlertServiceType = {
    queue: Map<number, AlertType>;
    pushAlert: ({ text, isPersistent }: AlertType) => void;
    popAlert: (key: number) => void;
};

const AlertServiceContext = createContext<AlertServiceType | undefined>(
    undefined,
);

export function AlertServiceProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    console.log("!!AlertServiceProvider");
    const [queue, updateQueue] = useState<Map<number, AlertType>>(new Map());

    const pushAlert = (alert: AlertType) => {
        updateQueue((curr) => {
            const copy = new Map(curr);
            copy.set(copy.size, alert);
            return copy;
        });
    };

    const popAlert = (key: number) => {
        updateQueue((curr) => {
            const copy = new Map(curr);
            copy.delete(key);
            return copy;
        });
    };

    const value = useMemo(
        () => ({
            popAlert,
            pushAlert,
            queue,
        }),
        [queue],
    );

    return (
        <AlertServiceContext.Provider value={value}>
            {children}
            <div
                css={{
                    position: "absolute",
                    insetBlockStart: "50px",
                    insetInlineStart: "5%",
                    inlineSize: "90%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {Array.from(queue.entries()).map(([key, alert]) => (
                    <Alert key={`alert-${key}`} queueKey={key} alert={alert} />
                ))}
            </div>
        </AlertServiceContext.Provider>
    );
}

export function useAlertService() {
    const context = useContext(AlertServiceContext);
    if (context === undefined) {
        throw new Error(
            "useAlertService must be used within AlertServiceContext",
        );
    }

    return context;
}

// const START_GAME_ALERT_1 =
//     "You hit the Meat Market in Compton. Prices are usually lower here, especially for Ribs.";

// const START_GAME_ALERT_2 =
//     "Keep an eye on the clock up top. It's 5:00am now, and you only have 24 hours.";
