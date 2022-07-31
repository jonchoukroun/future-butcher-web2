/** @jsx jsx */
import { jsx } from "@emotion/react";

import { EndGame } from "../../Screens/EndGame/EndGame";
import { ErrorScreen } from "../../Screens/ErrorScreen/ErrorScreen";
import { HighScores } from "../../Screens/HighScores/HighScores";
import { Login } from "../../Screens/Login/Login";
import { Market } from "../../Screens/Market/Market";
import { Mugging } from "../../Screens/Mugging/Mugging";
import { StatsScreen } from "../../Screens/Stats/StatsScreen";
import { Subway } from "../../Screens/Subway/Subway";
import { SurplusStore } from "../../Screens/SurplusStore/SurplusStore";
import { Welcome } from "../../Screens/Welcome/Welcome";
import { GameScreen } from "./GameScreen";
import { useWindowSize } from "./WindowSizeProvider";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const Window = () => {
    const { layout, windowSize } = useWindowSize();

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
                    backgroundColor: Colors.Background.base,
                }}
            >
                {currentScreen === "error" && <ErrorScreen />}

                {currentScreen === "login" && <Login />}

                {currentScreen === "welcome" && <Welcome />}

                {currentScreen === "market" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <Market />
                    </GameScreen>
                )}

                {currentScreen === "subway" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <Subway />
                    </GameScreen>
                )}

                {currentScreen === "store" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <SurplusStore />
                    </GameScreen>
                )}

                {currentScreen === "mugging" && (
                    <GameScreen layout={layout} shouldShowNavBar={false}>
                        <Mugging />
                    </GameScreen>
                )}

                {currentScreen === "endGame" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <EndGame />
                    </GameScreen>
                )}

                {currentScreen === "stats" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <StatsScreen />
                    </GameScreen>
                )}

                {currentScreen === "highScores" && <HighScores />}
            </div>
        </div>
    );
};
