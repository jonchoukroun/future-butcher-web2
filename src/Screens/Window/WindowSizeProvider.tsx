import * as React from "react";

const { createContext, useContext, useEffect, useState } = React;

const MINIMUM_COLUMN_WIDTH = 320;
const STATS_BAR_HEIGHT = 40;
const NAV_BAR_HEIGHT = 70;

export type Size = { blockSize: number; inlineSize: number };
export type LayoutType = "compact" | "full";

const WindowSizeContext = createContext<
    | {
          windowSize: Size;
          getContentSize: () => Size;
          layout: LayoutType;
          heightAdjustment: number;
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
    const [layout, setLayout] = useState<LayoutType>(getLayout(inlineSize));

    useEffect(() => {
        window.onresize = () => {
            const { blockSize, inlineSize } = handleSizing();
            setWindowSize({ blockSize, inlineSize });
            setLayout(getLayout(inlineSize));
        };
    }, []);

    const getContentSize = () => {
        const baseInline = windowSize.inlineSize - 7;
        return {
            blockSize: Math.round((windowSize.blockSize - 100) * 0.9),
            inlineSize:
                layout === "compact" ? baseInline : Math.round(baseInline / 2),
        };
    };

    const value = {
        windowSize,
        getContentSize,
        layout,
        heightAdjustment:
            layout === "full"
                ? NAV_BAR_HEIGHT
                : NAV_BAR_HEIGHT + STATS_BAR_HEIGHT,
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
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    return {
        blockSize: Math.min(innerHeight, 812),
        inlineSize: Math.min(innerWidth, 990),
    };
}

function getLayout(inlineSize: number): LayoutType {
    return inlineSize >= 2 * MINIMUM_COLUMN_WIDTH ? "full" : "compact";
}
