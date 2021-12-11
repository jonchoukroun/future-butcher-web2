/** @jsx jsx */
import { jsx } from "@emotion/react";

import { MainScreen } from "../MainScreen/MainScreen";
// import { Market } from "../Market/Market";
// import { StatsScreen } from "../Stats/StatsScreen";
// import { Subway } from "../Subway/Subway";
import { Welcome } from "../Welcome/Welcome";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const Window = () => {
    const { windowSize } = useWindowSize();

    const {
        state: { currentScreen },
    } = useGameState();

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
                {currentScreen === Screen.Welcome && <Welcome />}
                {currentScreen === Screen.Main && <MainScreen />}
            </div>
        </div>
    );
};
