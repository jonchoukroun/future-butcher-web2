import * as React from "react";

import { Intro } from "./Intro/intro";
import { Market } from "./Market/market";
import { Subway } from "./Subway/subway";

import "./App.scss";
import "./GameScreen.scss";

const enum GameScreen {
    Intro,
    Market,
    Subway,
}

export const App: React.FC = () => {
    const [gameScreen, setGameScreen] = React.useState(GameScreen.Subway);

    const visitMarket = () => setGameScreen(GameScreen.Market);

    const visitSubway = () => setGameScreen(GameScreen.Subway);

    let screen: JSX.Element | null = null;
    switch (gameScreen) {
        case GameScreen.Intro:
            screen = <Intro screenChanger={visitMarket} />;
            break;

        case GameScreen.Market:
            screen = <Market subwaySelector={visitSubway} />;
            break;

        case GameScreen.Subway:
            screen = <Subway marketSelector={visitMarket} />;
            break;
    }

    return <div className="game-container">{screen}</div>;
};
