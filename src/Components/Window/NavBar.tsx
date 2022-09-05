/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrompt, ButtonPromptSize } from "../ButtonPrompt";
import { useGameState } from "../../GameData/GameStateProvider";
import { Screen } from "../../GameData";
import { GameProcessType, ScreenType, StationType } from "../../GameData/State";

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

    const label = getButtonLabel(currentScreen, currentStation);

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

function getButtonLabel(screen: ScreenType | undefined, station: StationType) {
    switch (screen) {
        case "subway": {
            if (station === "bell_gardens") {
                return "Go to the Store";
            } else if (station === "venice_beach") {
                return "Go to the Clinic";
            } else {
                return "Buy or Sell Cuts";
            }
        }

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

    if (
        turnsLeft === 0 &&
        (screen === Screen.Market || screen === Screen.Clinic)
    ) {
        return Screen.LastTurn;
    }

    if (station === "bell_gardens") {
        if (screen === Screen.Store) return Screen.Subway;
        else return Screen.Store;
    }

    if (station === "venice_beach") {
        if (screen === "clinic") return Screen.Subway;
        else return Screen.Clinic;
    }

    if (screen === "market") return Screen.Subway;

    return Screen.Market;
}
