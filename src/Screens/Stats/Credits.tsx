/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";

export function Credits() {
    const { dispatch } = useGameState();
    const handleBackClick = () => {
        dispatch({ type: "changeScreen", screen: "stats" });
    };
    return (
        <ScreenTemplate
            title={"Acknowledgements"}
            content={[
                "Special thanks to everyone who's made this game possible:",
                "New client Beta testers: JPM, jitrah, Trtninc",
                "Top player of all time: Doh",
                "Future Butcher was designed and devloped by Jon Choukroun. The game runs on Elixir/Phoenix, React, and a lot of hot sauce.",
                "Copyright 2022",
                'Inspired by the John E. Dell class "Drug Wars"',
            ]}
            buttonLabel={"Back"}
            isLoading={false}
            clickCB={handleBackClick}
        />
    );
}
