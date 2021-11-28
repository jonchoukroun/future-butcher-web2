/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useState } from "react";

import { TopBar } from "./TopBar";
// import { useGameState } from "../GameState/GameStateProvider";
import { Subway } from "../Subway/Subway";
import { Welcome } from "../Welcome/Welcome";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

const enum Screen {
    Welcome = "Future Butcher",
    Subway = "Subway",
    Market = "Market",
}

export const Window = () => {
    // const { playerName } = useGameState();

    const [currentScreen] = useState<Screen>(() => {
        // if (playerName === undefined) return Screen.Welcome;
        return Screen.Subway;
    });

    const { windowSize } = useWindowSize();

    return (
        <div
            className="container"
            css={css({
                blockSize: window.innerHeight,
                inlineSize: window.innerWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            })}
        >
            <div
                className="outer-window"
                css={css({
                    blockSize: windowSize.blockSize,
                    inlineSize: windowSize.inlineSize,
                    paddingBlock: "1px",
                    paddingInline: "1px",
                    backgroundColor: Colors.Background.body,
                    borderBlockStartWidth: "2px",
                    borderBlockEndWidth: "3px",
                    borderInlineStartWidth: "2px",
                    borderInlineEndWidth: "3px",
                    borderStyle: "outset",
                    borderRadius: "2px",
                    borderBlockStartColor: Colors.Border.light,
                    borderInlineStartColor: Colors.Border.light,
                    borderBlockEndColor: Colors.Border.dark,
                    borderInlineEndColor: Colors.Border.dark,
                })}
            >
                <TopBar title={currentScreen} />

                {currentScreen === Screen.Welcome && <Welcome />}

                {currentScreen === Screen.Subway && <Subway />}
            </div>
        </div>
    );
};
