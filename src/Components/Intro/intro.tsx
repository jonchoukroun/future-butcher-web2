import * as React from "react";

import { Terminal } from "../Terminal/terminal";

import "./intro.scss";
import "../../Styles/crtGrid.scss";

const enum DetailEnum {
    Start,
    Background,
    Addiction,
    Turns,
    Loan,
    Compton,
}

function renderTerminalText(detail: DetailEnum): string[] {
    switch (detail) {
        case DetailEnum.Start:
            return [
                "The economy is in ruins after the collapse of HypeCoin. Civil unrest, crime, and electric scooters have turned the City of Angels into a nightmare.",
                "It's time to get out of town, but first you'll need some cash...",
            ];

        case DetailEnum.Background:
            return [
                "Your only shot is to hustle the new premium addiction of the rich and famous.",
                "You can make a lot dough servicing their demand for fresh, exclusive cuts of human meat...",
            ];

        case DetailEnum.Addiction:
            return ["...Not that you'd ever touch the stuff."];

        case DetailEnum.Turns:
            return [
                "You have 48 hours to buy and sell choice cuts and make a profit.",
                "Prices change every hour, so keep on eye on the markets.",
                "And don't let the clock run out...",
            ];

        case DetailEnum.Loan:
            return [
                "Your ShitiBank loan was approved, you now have $5,000 to hustle. But with an hourly interest rate of 5%, you better pay it off quick!",
                "Yean, it's steep. Welcome to the People's Republic of LA...",
            ];

        case DetailEnum.Compton:
            return [
                "It's 5 am in Compton. Time to hit the markets.",
                "And if you need some protection, Gus' Army Surplus Store opens in a few hours.",
                "Good luck, hustler.",
            ];
    }
}

interface IntroProps {
    screenChanger: () => void;
}

export const Intro: React.FC<IntroProps> = ({ screenChanger }: IntroProps) => {
    const [detail, setDetail] = React.useState(DetailEnum.Start);

    const terminalText = renderTerminalText(detail);

    const detailChanger = () => setDetail(detail + 1);

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

            {detail === DetailEnum.Compton ? (
                <Terminal
                    textArray={terminalText}
                    enterButtonBinding={screenChanger}
                />
            ) : (
                <Terminal
                    textArray={terminalText}
                    enterButtonBinding={detailChanger}
                />
            )}
        </div>
    );
};
