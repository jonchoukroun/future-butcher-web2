/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useGameState, Screen } from "../../GameData/GameStateProvider";

export const NavBar = () => {
    const { layout } = useWindowSize();

    const {
        state: { currentProcess, currentScreen },
        dispatch,
    } = useGameState();

    const label = getButtonLabel(currentScreen);

    const defaultScreen =
        currentProcess === "mugging" ? Screen.Mugging : Screen.Main;

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
                clickCB={() =>
                    dispatch({ type: "changeScreen", screen: defaultScreen })
                }
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
