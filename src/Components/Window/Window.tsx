/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef } from "react";

import { GameScreen } from "./GameScreen";
import { LayoutType, useWindowSize } from "./WindowSizeProvider";
import { useAlertService } from "../../AlertService/AlertServiceProvider";
import { useGameState } from "../../GameData/GameStateProvider";
import { Clinic } from "../../Screens/Clinic/Clinic";
import { Death } from "../../Screens/Death/Death";
import { ErrorScreen } from "../../Screens/ErrorScreen/ErrorScreen";
import { GameResult } from "../../Screens/GameResult/GameResult";
import { HighScores } from "../../Screens/HighScores/HighScores";
import { LastTurn } from "../../Screens/LastTurn/LastTurn";
import { Login } from "../../Screens/Login/Login";
import { Market } from "../../Screens/Market/Market";
import { Mugging } from "../../Screens/Mugging/Mugging";
import { Credits } from "../../Screens/Stats/Credits";
import { StatsScreen } from "../../Screens/Stats/StatsScreen";
import { Subway } from "../../Screens/Subway/Subway";
import { SurplusStore } from "../../Screens/SurplusStore/SurplusStore";
import { Welcome } from "../../Screens/Welcome/Welcome";
import * as Colors from "../../Styles/colors";
import { getTimeLeft } from "../../Utils/getTimeLeft";

export const Window = () => {
    const { layout, windowSize } = useWindowSize();

    const { pushAlert } = useAlertService();

    const {
        state: { currentScreen, currentStation, screenProps, turnsLeft },
    } = useGameState();

    const turnRef = useRef<number>();
    const hasShownTravelAlertRef = useRef(false);
    const hasShownBellGardensAlertRef = useRef(false);
    useEffect(() => {
        if (turnRef.current && turnRef.current === turnsLeft) {
            return;
        }

        turnRef.current = turnsLeft;
        if (turnRef.current === undefined) return;
        if (turnRef.current === 24) {
            pushAlert({
                text: MEAT_MARKET_ALERT,
                isPersistent: true,
            });
        } else if (turnRef.current > 20 && !hasShownTravelAlertRef.current) {
            pushAlert({
                text: getTravelAlert(turnRef.current, layout),
                isPersistent: true,
            });
            hasShownTravelAlertRef.current = true;
        }
        if (
            turnRef.current < 21 &&
            turnRef.current >= 18 &&
            currentStation !== "bell_gardens" &&
            !hasShownBellGardensAlertRef.current
        ) {
            pushAlert({
                text: BELL_GARDENS_ALERT,
                isPersistent: true,
            });
            hasShownBellGardensAlertRef.current = true;
        }
    }, [currentStation, layout, pushAlert, turnsLeft]);

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

                {currentScreen === "welcome" && (
                    <Welcome startScreen={screenProps} />
                )}

                {currentScreen === "death" && <Death />}

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

                {currentScreen === "clinic" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <Clinic />
                    </GameScreen>
                )}

                {currentScreen === "mugging" && (
                    <GameScreen layout={layout} shouldShowNavBar={false}>
                        <Mugging />
                    </GameScreen>
                )}

                {currentScreen === "lastTurn" && (
                    <GameScreen layout={layout} shouldShowNavBar={false}>
                        <LastTurn />
                    </GameScreen>
                )}

                {currentScreen === "stats" && (
                    <GameScreen layout={layout} shouldShowNavBar={true}>
                        <StatsScreen />
                    </GameScreen>
                )}

                {currentScreen === "gameResult" && <GameResult />}

                {currentScreen === "credits" && <Credits />}

                {currentScreen === "highScores" && <HighScores />}
            </div>
        </div>
    );
};

const MEAT_MARKET_ALERT =
    "You hit the Meat Market in Compton. Prices are usually lower here, especially for Liver and Ribs.";

function getTravelAlert(turnsLeft: number, layout: LayoutType) {
    const statsStr =
        layout === "compact"
            ? "Click the stats bar above to see more details and pay off your debt."
            : "Use the stats screen on the left to track your progress and pay off your debt.";
    return `Keep an eye on the clock. It's ${getTimeLeft(
        turnsLeft,
    )} now, and you only have ${turnsLeft} hours left. ${statsStr}`;
}

const BELL_GARDENS_ALERT =
    "Gus's Army Surplus Store is now open in Bell Gardens. They'll hook you up with weapons and bigger packs. Better hurry though, prices go up every hour and they close at midnight.";
