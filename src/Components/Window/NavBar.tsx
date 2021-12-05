/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { useGameState, Screen } from "../GameState/GameStateProvider";
import { ButtonPrimary } from "../Form/ButtonPrimary";

export const NavBar = () => {
    const { layout } = useWindowSize();
    const { changeScreen } = useGameState();

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
                type={"Stretch"}
                label={"Back"}
                clickCB={() => changeScreen(Screen.Main)}
            />
        </div>
    );
};
