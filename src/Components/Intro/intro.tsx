import * as React from "react";

import "./intro.scss";
import "../../Styles/crtGrid.scss";

type ScreenType = "start" | "end";

interface IntroProps {
    screen: ScreenType;
}

export const Intro: React.FC<IntroProps> = ({ screen }: IntroProps) => {
    switch (screen) {
        case "start":
            const dateOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            const currentDate = new Date().toLocaleDateString(
                "en-us",
                dateOptions,
            );

            return (
                <div className="intro-image crt-grid">
                    <div className="intro-text">
                        <h1 className="digital-text">Los Angeles...</h1>
                        <h2>{currentDate}</h2>
                    </div>
                </div>
            );

        default:
            return null;
    }
};
