import * as React from "react";

import { Intro } from "./Intro/intro";
import { Market } from "./Market/market";

import "./App.scss";

const enum GameScreen {
    Intro,
    Market,
    Subway,
}

export const App: React.FC = () => {
    const [gameScreen, setGameScreen] = React.useState(GameScreen.Market);

    const visitMarket = () => setGameScreen(GameScreen.Market);

    const visitSubway = () => setGameScreen(GameScreen.Subway);

    switch (gameScreen) {
        case GameScreen.Intro:
            return <Intro screenChanger={visitMarket} />;

        case GameScreen.Market:
            return <Market subwaySelector={visitSubway} />;

        case GameScreen.Subway:
            return <h1>Subway</h1>;

        default:
            return null;
    }
};
