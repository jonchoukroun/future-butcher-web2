/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import { useGameState } from "../GameState/GameStateProvider";
import { Market } from "../Market/Market";
// import { Subway } from "../Subway/Subway";
import { Welcome } from "../Welcome/Welcome";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export enum Screen {
    Welcome = "Future Butcher",
    Subway = "Subway",
    Market = "Market",
    SurplusStore = "Gus's Army Surplus",
    HardwareStore = "Hardware Store",
    Bank = "Bank",
    Clinic = "Free Clinic",
}

export const Window = () => {
    const { playerName } = useGameState();
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Market);
    useEffect(() => {
        if (!playerName) return;
        setCurrentScreen(Screen.Market);
    });

    const { windowSize } = useWindowSize();

    return (
        <div
            className="container"
            css={{
                blockSize: window.innerHeight,
                inlineSize: window.innerWidth,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="outer-window"
                css={{
                    blockSize: windowSize.blockSize,
                    inlineSize: windowSize.inlineSize,
                    paddingBlock: "1px",
                    paddingInline: "1px",
                    backgroundColor: Colors.Background.screen,
                    borderColor: Colors.Border.subtle,
                    borderRadius: "14px",
                    borderStyle: "solid",
                    borderWidth: "2px",
                }}
            >
                {currentScreen === Screen.Welcome && <Welcome />}

                {currentScreen === Screen.Market && <Market />}
            </div>
        </div>
    );
};
