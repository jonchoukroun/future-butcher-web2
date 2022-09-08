/** @jsx jsx */
import { jsx } from "@emotion/react";
import { createContext, useContext, useMemo, useState } from "react";

import { Alert } from "./Alert";
import { useWindowSize } from "../Components/Window/WindowSizeProvider";

export type AlertType = {
    text: string;
    isPersistent: boolean;
};

type AlertServiceType = {
    queue: Map<number, AlertType>;
    clearAlerts: () => void;
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
    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();

    const [queue, updateQueue] = useState<Map<number, AlertType>>(new Map());

    const clearAlerts = () => {
        updateQueue(new Map());
    };

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
            clearAlerts,
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
                    justifyContent: "center",
                }}
            >
                <div
                    css={{
                        inlineSize:
                            layout === "full" ? `${inlineSize}px` : "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {Array.from(queue.entries()).map(([key, alert]) => (
                        <Alert
                            key={`alert-${key}`}
                            queueKey={key}
                            alert={alert}
                        />
                    ))}
                </div>
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
