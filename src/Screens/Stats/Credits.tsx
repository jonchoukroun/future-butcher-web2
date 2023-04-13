/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment } from "react";

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
                "Legacy Champ: Doh ($7,388,526)",
                "Special thanks to the Beta testers who made this game possible: Dougler, JPM, Trtninc, Burger, and many others.",
                <Fragment key="home-link">
                    Future Butcher was designed and devloped by Jon Choukroun.
                    The game runs on Elixir/Phoenix and React. Find out more at{" "}
                    <a
                        href="https://jonchoukroun.com/future-butcher.html"
                        target="_blank"
                        rel="noreferrer"
                    >
                        JonChoukroun.com
                    </a>
                    {"."}
                </Fragment>,
                'Copyright 2022. Inspired by the John E. Dell classic "Drug Wars."',
            ]}
            showShareLine={true}
            primaryButtonLabel={"Back"}
            primaryIsLoading={false}
            primaryClickCB={handleBackClick}
        />
    );
}
