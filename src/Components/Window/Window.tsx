/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

import { TopBar } from "./TopBar";
import { Subway } from "../Subway/Subway";
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
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
    const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(false);
    const handleDesignMenuButtonClick = () => {
        setIsDesignMenuOpen((isOpen) => !isOpen);
    };
    const handleScreenChange = (screen: Screen) => {
        setCurrentScreen(screen);
        setIsDesignMenuOpen(false);
    };

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
                }}
            >
                <TopBar
                    title={currentScreen}
                    isDesignMenuOpen={isDesignMenuOpen}
                    onDesignMenuButtonClick={handleDesignMenuButtonClick}
                    handleScreenChange={handleScreenChange}
                />

                {currentScreen === Screen.Welcome && <Welcome />}

                {currentScreen === Screen.Subway && <Subway />}
            </div>
        </div>
    );
};
