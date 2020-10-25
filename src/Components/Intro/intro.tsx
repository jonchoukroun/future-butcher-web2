import * as React from "react";

import "./intro.scss";

interface IntroProps {
    screen: "start" | "end";
}

export const Intro: React.FC<IntroProps> = ({ screen }) => {
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const currentDate = new Date().toLocaleDateString("en-us", dateOptions);
    return(
        <>
            { screen === "start" &&
                <div className="intro-image">
                    <div className="intro-text">
                        <h1 className="digital-text">Los Angeles...</h1>
                        <h5>{currentDate}</h5>
                    </div>
                </div>
            }
        </>
    )
}
