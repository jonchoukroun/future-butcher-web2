/** @jsx jsx */
import { jsx } from "@emotion/react";

import { LayoutType } from "./WindowSizeProvider";
import { StatsBar } from "../Stats/StatsBar";
import { StatsScreen } from "../Stats/StatsScreen";
import { NavBar } from "../Window/NavBar";
import { Screen, useGameState } from "../../GameData/GameStateProvider";

interface GameScreenProps {
    layout: LayoutType;
    Component: JSX.Element | null;
    shouldShowNavBar: boolean;
}

export const GameScreen = ({
    layout,
    Component,
    shouldShowNavBar,
}: GameScreenProps) => {
    const {
        state: { currentScreen },
    } = useGameState();
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
                    {Component}
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
                {Component}
                {shouldShowNavBar && <NavBar />}
            </div>
        );
    }
};
