/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { ScreenTemplate } from "../../Components/ScreenTemplate";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { HighScoresType, isApiError } from "../../GameData/State";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

const WELCOME_TITLE = "Los Angeles";

const INTRO_CONTENT = [
    "The economy is in ruins after the totally unforseen collapse of HypeCoin. It's time to leave town, but first you'll need cash.",
    "Fortunately the rich and famous are nuts for the latest fad - fresh cuts of human meat!",
    "Two-bit hustlers like you have only one option: get rich off this new addiction before becoming the product.",
];

const INSTRUCTIONS_CONTENT = [
    "You wake up in Compton, ready to hustle.",
    "A coyote will pick you up in 24 hours to smuggle you across the border to Mexico.",
    "Use the Subway to nagivate the city's neighborhoods. Buy and sell from the Meat Markets, but watch your back! Gangs run the city, and you don't want to cross them.",
    "If you need protection or a bigger pack, Gus's Army Surplus store in Bell Gardens opens at 9am.",
];

const START_CONTENT_BASE = [
    "To get started you hooked up a $5,000 loan from the bank - with a 5% hourly interest rate.",
    "Yeah, it's steep. Welcome to the People's Republic of Los Angeles...",
];

export const Welcome = () => {
    const date = new Date();
    date.setFullYear(2055, date.getMonth(), date.getDate());
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const displayDate = date.toLocaleDateString("en-US", options);

    const { handleGetScores, handlePushCallback } = useChannel();
    const { dispatch } = useGameState();

    const enum WelcomeScreen {
        Intro,
        Instructions,
        Start,
    }
    const [screen, setScreen] = useState<WelcomeScreen>(WelcomeScreen.Intro);
    const [lowestScore, setLowestScore] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);

    const didRequestScoresRef = useRef(false);

    useEffect(() => {
        if (lowestScore || didRequestScoresRef.current) return;

        const getScores = async () => {
            didRequestScoresRef.current = true;
            const response = await handleGetScores();
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
            }

            const responseSize = (response as HighScoresType).length;
            setLowestScore(
                (response as HighScoresType)[Math.min(99, responseSize - 1)]
                    .score,
            );
        };
        getScores();
    }, [dispatch, handleGetScores, lowestScore]);

    const startContent = lowestScore
        ? [
              ...START_CONTENT_BASE,
              `The coyote's current rate is ${formatMoney(
                  lowestScore,
              )}. Anything less and you'll be stranded in LA.`,
          ]
        : START_CONTENT_BASE;

    const handleIncrementScreen = () => {
        setScreen((cur) => cur + 1);
    };

    const handleStartClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback("startGame", {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        if (response.rules.state !== "in_game") {
            dispatch({ type: "changeScreen", screen: Screen.Login });
            return;
        }

        dispatch({ type: "updateStateData", stateData: response });
        dispatch({ type: "changeScreen", screen: Screen.Market });
        setIsLoading(false);
    };

    return (
        <Fragment>
            {screen === WelcomeScreen.Intro && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    subtitle={displayDate}
                    content={INTRO_CONTENT}
                    buttonLabel={"Next"}
                    isLoading={false}
                    clickCB={handleIncrementScreen}
                />
            )}

            {screen === WelcomeScreen.Instructions && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    subtitle={"Compton, 5am"}
                    content={INSTRUCTIONS_CONTENT}
                    buttonLabel={"Next"}
                    isLoading={isLoading}
                    clickCB={handleIncrementScreen}
                />
            )}

            {/* TODO: provide Tutorial on/off button */}
            {screen === WelcomeScreen.Start && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    content={startContent}
                    buttonLabel={"Start Game"}
                    isLoading={isLoading}
                    clickCB={handleStartClick}
                />
            )}
        </Fragment>
    );
};
