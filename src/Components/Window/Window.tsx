/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    useGameState,
    GameProcess,
    Screen,
} from "../GameState/GameStateProvider";
import { MainScreen } from "../MainScreen/MainScreen";
import { Market } from "../Market/Market";
import { StatsScreen } from "../Stats/StatsScreen";
import { Subway } from "../Subway/Subway";
import { Welcome } from "../Welcome/Welcome";
import { GameScreen } from "../Window/GameScreen";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Window = () => {
    const { layout, windowSize } = useWindowSize();

    const { process, currentScreen } = useGameState();

    const ScreenComponent = getComponent(currentScreen);

    return (
        <div
            className="container"
            css={{
                blockSize: window.innerHeight,
                inlineSize: window.innerWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="outer-window"
                css={{
                    blockSize: windowSize.blockSize,
                    inlineSize: windowSize.inlineSize,
                    paddingBlock: "1px",
                    paddingInline: "1px",
                    backgroundColor: Colors.Background.screen,
                    borderColor: Colors.Border.subtle,
                    borderRadius: "14px",
                    borderStyle: "solid",
                    borderWidth: "2px",
                }}
            >
                {process === GameProcess.intro && <Welcome />}

                {process === GameProcess.inGame && (
                    <GameScreen
                        layout={layout}
                        Component={ScreenComponent}
                        shouldShowNavBar={currentScreen !== Screen.Main}
                    />
                )}

                {process === GameProcess.end && (
                    <div>
                        <h1>Game Over</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

function getComponent(screen: Screen): (() => JSX.Element) | null {
    switch (screen) {
        case Screen.Main:
            return MainScreen;

        case Screen.Market:
            return Market;

        case Screen.Subway:
            return Subway;

        case Screen.Stats:
            return StatsScreen;

        default:
            return null;
    }
}
