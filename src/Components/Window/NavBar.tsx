/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "./WindowSizeProvider";
import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useGameState, Screen } from "../../GameData/GameStateProvider";

export const NavBar = () => {
    const { layout } = useWindowSize();

    const { dispatch } = useGameState();

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
                clickCB={() =>
                    dispatch({ type: "changeScreen", screen: Screen.Main })
                }
            />
        </div>
    );
};
