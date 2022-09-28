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
    "Use the Subway to nagivate the city's neighborhoods. Buy and sell from the Meat Markets, but watch your back! The streets are dangerous.",
    "If you need protection or a bigger pack, Gus's Army Surplus store in Bell Gardens opens at 9am.",
    "Check out the 24 Hour Free Clinic in Venice Beach to get patched up or buy supplements.",
];

const START_CONTENT_BASE = [
    "The bank hooked you up with a $5,000 loan - at a 15% hourly interest rate.",
    "Yeah, it's steep. Welcome to the People's Republic of Los Angeles. Be sure to pay it off, the bank doesn't fool around.",
];

const START_OVER_CONTENT = [
    "You know the drill, you have $5,000 and 24 hours.",
    "Are you ready to give it another shot?",
];

export enum WelcomeScreen {
    Intro,
    Instructions,
    Start,
    StartOver,
}

export const Welcome = ({ startScreen }: { startScreen?: WelcomeScreen }) => {
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

    const [screen, setScreen] = useState<WelcomeScreen>(
        startScreen ? startScreen : WelcomeScreen.Intro,
    );
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
                    primaryButtonLabel={"Next"}
                    primaryIsLoading={false}
                    primaryClickCB={handleIncrementScreen}
                />
            )}

            {screen === WelcomeScreen.Instructions && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    subtitle={"Compton, 5:00 am"}
                    content={INSTRUCTIONS_CONTENT}
                    primaryButtonLabel={"Next"}
                    primaryIsLoading={isLoading}
                    primaryClickCB={handleIncrementScreen}
                />
            )}

            {screen === WelcomeScreen.Start && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    content={startContent}
                    primaryButtonLabel={"Start Game"}
                    primaryIsLoading={isLoading}
                    primaryClickCB={handleStartClick}
                />
            )}

            {/* TODO: provide Tutorial on/off button */}
            {screen === WelcomeScreen.StartOver && (
                <ScreenTemplate
                    title={WELCOME_TITLE}
                    content={START_OVER_CONTENT}
                    primaryButtonLabel={"Start Game"}
                    primaryIsLoading={isLoading}
                    primaryClickCB={handleStartClick}
                />
            )}
        </Fragment>
    );
};
