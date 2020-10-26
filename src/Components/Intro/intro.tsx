import * as React from "react";

import { Terminal } from "../Terminal/terminal";

import "./intro.scss";
import "../../Styles/crtGrid.scss";

type ScreenType = "start" | "end";

interface IntroProps {
    screen: ScreenType;
}

function renderTerminal(screen: ScreenType): JSX.Element | null {
    let textArray: string[];
    switch (screen) {
        case "start":
            textArray = [
                "The economy is in ruins after the collapse of HypeCoin. Civil unrest, crime, and electric scooters have turned the once beautiful city into a nightmare.",
                "It&apos;s time to get out of town, but you&apos;ll need some cash first.",
            ];

            return <Terminal textArray={textArray} />;

        case "end":
            textArray = ["This is it."];
            return <Terminal textArray={textArray} />;

        default:
            return null;
    }
}

export const Intro: React.FC<IntroProps> = ({ screen }: IntroProps) => {
    const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const currentDate = new Date().toLocaleDateString("en-us", dateOptions);

    return (
        <div className="intro-image crt-grid">
            <div className="intro-text">
                <h1 className="digital-text">Los Angeles...</h1>
                <h2>{currentDate}</h2>
            </div>

            {screen && renderTerminal(screen)}
        </div>
    );
};
