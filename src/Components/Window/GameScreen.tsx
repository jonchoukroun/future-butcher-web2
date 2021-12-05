/** @jsx jsx */
import { jsx } from "@emotion/react";

import { LayoutType } from "./WindowSizeProvider";
import { Screen, useGameState } from "../GameState/GameStateProvider";
import { StatsBar } from "../Stats/StatsBar";
import { StatsScreen } from "../Stats/StatsScreen";
import { NavBar } from "../Window/NavBar";

interface GameScreenProps {
    layout: LayoutType;
    Component: (() => JSX.Element) | null;
    shouldShowNavBar: boolean;
}

export const GameScreen = ({
    layout,
    Component,
    shouldShowNavBar,
}: GameScreenProps) => {
    const { currentScreen } = useGameState();
    if (layout === "full") {
        return (
            <div
                css={{
                    blockSize: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "8px",
                }}
            >
                <div
                    css={{
                        blockSize: "100%",
                        inlineSize: "50%",
                        paddingInlineEnd: "46px",
                    }}
                >
                    <StatsScreen />
                </div>
                <div
                    css={{
                        blockSize: "100%",
                        inlineSize: "50%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "space-between",
                    }}
                >
                    {Component && <Component />}
                    {shouldShowNavBar && <NavBar />}
                </div>
            </div>
        );
    } else {
        return (
            <div
                css={{
                    position: "relative",
                    blockSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {}
                {currentScreen !== Screen.Stats && <StatsBar />}
                {Component && <Component />}
                {shouldShowNavBar && <NavBar />}
            </div>
        );
    }
};
