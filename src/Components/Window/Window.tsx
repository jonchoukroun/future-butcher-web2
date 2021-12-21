/** @jsx jsx */
import { jsx } from "@emotion/react";

import { EndGame } from "../EndGame/EndGame";
import { ErrorScreen } from "../ErrorScreen/ErrorScreen";
import { HighScores } from "../HighScores/HighScores";
import { Login } from "../Login/Login";
import { MainScreen } from "../MainScreen/MainScreen";
import { Market } from "../Market/Market";
import { Mugging } from "../Mugging/Mugging";
import { StatsScreen } from "../Stats/StatsScreen";
import { Subway } from "../Subway/Subway";
import { Welcome } from "../Welcome/Welcome";
import { GameScreen } from "../Window/GameScreen";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
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
                    borderColor: Colors.Border.subtle,
                    borderRadius: "10px",
                    borderStyle: "solid",
                    borderWidth: "2px",
                }}
            >
                {currentScreen === Screen.Error && <ErrorScreen />}

                {currentScreen === Screen.Login && <Login />}

                {currentScreen === Screen.Welcome && <Welcome />}

                {currentScreen === Screen.Main && (
                    <GameScreen layout={layout} shouldShowNavBar={false}>
                        <MainScreen />
                    </GameScreen>
                )}

                {currentScreen === Screen.Market && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <Market />
                    </GameScreen>
                )}

                {currentScreen === Screen.Subway && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <Subway />
                    </GameScreen>
                )}

                {currentScreen === Screen.Mugging && (
                    <GameScreen layout={layout} shouldShowNavBar={false}>
                        <Mugging />
                    </GameScreen>
                )}

                {currentScreen === Screen.EndGame && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <EndGame />
                    </GameScreen>
                )}

                {currentScreen === Screen.Stats && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <StatsScreen />
                    </GameScreen>
                )}

                {currentScreen === Screen.HighScores && <HighScores />}
            </div>
        </div>
    );
};
