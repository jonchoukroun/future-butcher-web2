/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrompt, ButtonPromptSize } from "../ButtonPrompt";
import {
    GameProcess,
    Screen,
    useGameState,
} from "../../GameData/GameStateProvider";
import { StationKey } from "../../Fixtures/subwayStations";

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
        currentStation === StationKey.bellGardens,
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
                blink={false}
                clickCB={() => dispatch({ type: "changeScreen", screen })}
            />
        </div>
    );
};

function getButtonLabel(screen: Screen | undefined, isBellGardens: boolean) {
    switch (screen) {
        case Screen.Subway:
            return isBellGardens ? "Go to the Store" : "Go to the Market";

        case Screen.Market:
            return "Go to the Subway";

        default:
            return "Back to the Streets";
    }
}

function getNextScreen(
    process: GameProcess,
    screen: Screen,
    station: string,
    turnsLeft: number,
) {
    if (process === "mugging") return Screen.Mugging;

    if (turnsLeft === 1 && screen === Screen.Market) return Screen.EndGame;

    if (station === StationKey.bellGardens) {
        if (screen === Screen.SurplusStore) return Screen.Subway;
        else return Screen.SurplusStore;
    }

    if (screen === Screen.Market) return Screen.Subway;

    return Screen.Market;
}
