/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

export function Credits() {
    const { dispatch } = useGameState();
    const { layout } = useWindowSize();
    const handleBackClick = () => {
        if (layout === "full") {
            dispatch({ type: "changeScreen", screen: Screen.Market });
        } else {
            dispatch({ type: "changeScreen", screen: Screen.Stats });
        }
    };
    return (
        <ScreenTemplate
            title={"Acknowledgements"}
            content={[
                "Special thanks to everyone who's made this game possible:",
                "Beta testers: JPM, jitrah, Dougler, Trtninc",
                "Top players of all time: Doh & Hannah",
                "Future Butcher was designed and devloped by Jon Choukroun. The game runs on Elixir/Phoenix and React.",
                "Copyright 2022",
                'Inspired by the John E. Dell classic "Drug Wars."',
            ]}
            primaryButtonLabel={"Back"}
            primaryIsLoading={false}
            primaryClickCB={handleBackClick}
        />
    );
}
