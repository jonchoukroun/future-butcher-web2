import * as React from "react";

import { Intro } from "./Intro/intro";

import "./App.scss";

const enum GameScreen {
    Intro,
    Market,
    Subway,
}

export const App: React.FC = () => {
    const [gameScreen, setGameScreen] = React.useState(GameScreen.Intro);

    const visitMarket = () => setGameScreen(GameScreen.Market);

    switch (gameScreen) {
        case GameScreen.Intro:
            return <Intro screenChanger={visitMarket} />;

        case GameScreen.Market:
            return <h1>Market</h1>;

        default:
            return null;
    }
};
