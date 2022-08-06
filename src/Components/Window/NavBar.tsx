/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrompt, ButtonPromptSize } from "../ButtonPrompt";
import { useGameState } from "../../GameData/GameStateProvider";
import { Screen } from "../../GameData";
import { GameProcessType, ScreenType } from "../../GameData/State";

export const NavBar = () => {
    const { layout } = useWindowSize();

    const {
        state: { currentProcess, currentScreen, currentStation, turnsLeft },
        dispatch,
    } = useGameState();
    if (
        currentProcess === undefined ||
        currentScreen === undefined ||
        currentStation === undefined ||
        turnsLeft === undefined
    ) {
        throw new Error("State is undefined");
    }

    const label = getButtonLabel(
        currentScreen,
        currentStation === "bell_gardens",
    );

    const screen = getNextScreen(
        currentProcess,
        currentScreen,
        currentStation,
        turnsLeft,
    );
    return (
        <div
            css={{
                position: layout === "compact" ? "absolute" : "relative",
                bottom: 0,
                blockSize: "70px",
                inlineSize: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
            }}
        >
            <ButtonPrompt
                size={ButtonPromptSize.Full}
                label={label}
                inverse
                blink={false}
                clickCB={() => dispatch({ type: "changeScreen", screen })}
            />
        </div>
    );
};

function getButtonLabel(
    screen: ScreenType | undefined,
    isBellGardens: boolean,
) {
    switch (screen) {
        case "subway":
            return isBellGardens ? "Go to the Store" : "Buy or Sell Cuts";

        case "market":
            return "Take the Subway";

        default:
            return "Back to the Streets";
    }
}

function getNextScreen(
    process: GameProcessType,
    screen: ScreenType,
    station: string,
    turnsLeft: number,
) {
    if (process === "mugging") return Screen.Mugging;

    if (turnsLeft === 0 && screen === "market") return Screen.LastTurn;

    if (station === "bell_gardens") {
        if (screen === "store") return Screen.Subway;
        else return Screen.Store;
    }

    if (screen === "market") return Screen.Subway;

    return Screen.Market;
}
