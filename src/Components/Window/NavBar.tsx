/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrimary } from "../Form/ButtonPrimary";
import {
    GameProcess,
    Screen,
    useGameState,
} from "../../GameData/GameStateProvider";
import { StationKey } from "../../Fixtures/subwayStations";

export const NavBar = () => {
    const { layout } = useWindowSize();

    const {
        state: { currentProcess, currentScreen, currentStation },
        dispatch,
    } = useGameState();

    if (!currentProcess || !currentScreen || !currentStation) return;

    const label = getButtonLabel(currentScreen);

    const screen = getNextScreen(currentProcess, currentScreen, currentStation);
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
            }}
        >
            <ButtonPrimary
                type={"Block"}
                label={label}
                clickCB={() => dispatch({ type: "changeScreen", screen })}
            />
        </div>
    );
};

function getButtonLabel(screen: Screen | undefined) {
    switch (screen) {
        case Screen.Subway:
            return "Leave Subway";

        case Screen.Market:
            return "Leave Market";

        default:
            return "Back to the Streets";
    }
}

function getNextScreen(process: GameProcess, screen: Screen, station: string) {
    if (process === "mugging") return Screen.Mugging;

    if (station === StationKey.bellGardens) {
        if (screen === Screen.SurplusStore) return Screen.Subway;
        else return Screen.SurplusStore;
    }

    if (screen === Screen.Market) return Screen.Subway;

    return Screen.Market;
}
