/** @jsx jsx */
import { jsx } from "@emotion/react";

import { NavBar } from "./NavBar";
import { LayoutType } from "./WindowSizeProvider";
import { useGameState } from "../../GameData/GameStateProvider";
import { StatsScreen } from "../../Screens/Stats/StatsScreen";
import { StatsBar } from "../../Screens/Stats/StatsBar";

interface GameScreenProps {
    layout: LayoutType;
    shouldShowNavBar: boolean;
    children: React.ReactNode;
}

export const GameScreen = ({
    layout,
    shouldShowNavBar,
    children,
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
                    {children}
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
                {currentScreen !== "stats" && <StatsBar />}
                {children}
                {shouldShowNavBar && <NavBar />}
            </div>
        );
    }
};
