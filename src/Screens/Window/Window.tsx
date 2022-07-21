/** @jsx jsx */
import { jsx } from "@emotion/react";

import { EndGame } from "../EndGame/EndGame";
import { ErrorScreen } from "../ErrorScreen/ErrorScreen";
import { HighScores } from "../HighScores/HighScores";
import { Login } from "../Login/Login";
import { Market } from "../Market/Market";
import { Mugging } from "../Mugging/Mugging";
import { StatsScreen } from "../Stats/StatsScreen";
import { Subway } from "../Subway/Subway";
import { SurplusStore } from "../SurplusStore/SurplusStore";
import { Welcome } from "../Welcome/Welcome";
import { GameScreen } from "./GameScreen";
import { useWindowSize } from "./WindowSizeProvider";
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
                }}
            >
                {currentScreen === Screen.Error && <ErrorScreen />}

                {currentScreen === Screen.Login && <Login />}

                {currentScreen === Screen.Welcome && <Welcome />}

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

                {currentScreen === Screen.SurplusStore && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <SurplusStore />
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
