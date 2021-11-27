import * as React from "react";

const { createContext, useContext, useEffect, useState } = React;

type WindowSize = { block: number; inline: number };

const WindowSizeContext = createContext<WindowSize | undefined>(undefined);

/**
 * This provider sets the size of the window from the viewport
 * and vends the absolute size for different window types
 */
export function WindowSizeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [windowSize, setWindowSize] = useState<WindowSize>(handleSizing());

    useEffect(() => {
        window.onresize = () => setWindowSize(handleSizing());
    }, []);

    return (
        <WindowSizeContext.Provider value={windowSize}>
            {children}
        </WindowSizeContext.Provider>
    );
}

export function useWindowSize() {
    const context = useContext(WindowSizeContext);
    if (context === undefined) {
        throw new Error(
            "useWindowSize must be used within a WindowSizeProvider",
        );
    }
    return context;
}

function handleSizing() {
    const innerWidth = window.innerWidth - 10;
    const innerHeight = window.innerHeight - 10;

    return {
        block: Math.min(innerHeight, 990),
        inline: Math.min(innerWidth, 812),
    };
}
