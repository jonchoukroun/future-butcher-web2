import * as React from "react";

const { createContext, useContext, useEffect, useState } = React;

type Size = { blockSize: number; inlineSize: number };

const WindowSizeContext = createContext<
    | {
          windowSize: Size;
          getContentSize: (el: HTMLElement) => Size;
      }
    | undefined
>(undefined);

/**
 * This provider sets the size of the window from the viewport
 * and vends the absolute size for different window types
 */
export function WindowSizeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [windowSize, setWindowSize] = useState<Size>(handleSizing());

    useEffect(() => {
        window.onresize = () => setWindowSize(handleSizing());
    }, []);

    const getContentSize = (el: HTMLElement) => {
        const { width, height } = el.getBoundingClientRect();
        return {
            blockSize: height - 39,
            inlineSize: width - 7,
        };
    };

    const value = {
        windowSize,
        getContentSize,
    };

    return (
        <WindowSizeContext.Provider value={value}>
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
    const innerWidth = window.innerWidth - 8;
    const innerHeight = window.innerHeight - 8;

    return {
        blockSize: Math.min(innerHeight, 990),
        inlineSize: Math.min(innerWidth, 812),
    };
}
