import * as React from "react";

const { createContext, useContext, useEffect, useState } = React;

type Size = { blockSize: number; inlineSize: number };

const WindowSizeContext = createContext<
    | {
          windowSize: Size;
          getContentSize: () => Size;
          isCompact: boolean;
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
    const { blockSize, inlineSize } = handleSizing();
    const [windowSize, setWindowSize] = useState<Size>({
        blockSize,
        inlineSize,
    });
    const [isCompact, setIsCompact] = useState(inlineSize <= 812);

    useEffect(() => {
        window.onresize = () => {
            const { blockSize, inlineSize } = handleSizing();
            setWindowSize({ blockSize, inlineSize });
            setIsCompact(inlineSize <= 812);
        };
    }, []);

    const getContentSize = () => {
        return {
            blockSize: windowSize.blockSize - 39,
            inlineSize: windowSize.inlineSize - 7,
        };
    };

    const value = {
        windowSize,
        getContentSize,
        isCompact,
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
        blockSize: Math.min(innerHeight, 812),
        inlineSize: Math.min(innerWidth, 990),
    };
}
