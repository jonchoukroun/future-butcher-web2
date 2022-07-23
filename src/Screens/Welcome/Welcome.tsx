/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ScreenTemplate } from "../../Components/ScreenTemplate";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import { player } from "../../Fixtures/player";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

export const Welcome = () => {
    const date = new Date();
    date.setFullYear(2055, date.getMonth(), date.getDate());
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const displayDate = date.toLocaleDateString("en-US", options);

    const { handlePushCallback } = useChannel();
    const { dispatch } = useGameState();
    const [isLoading, setIsLoading] = useState(false);
    const handleStartClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback(Callback.startGame, {});
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        if (response.rules.state !== "in_game") {
            dispatch({ type: "changeScreen", screen: Screen.Login });
            return;
        }

        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData: response });
            dispatch({ type: "changeScreen", screen: Screen.Market });
            setIsLoading(false);
        });
    };

    return (
        <ScreenTemplate
            title={"Los Angeles"}
            subtitle={displayDate}
            content={[
                "The economy is in ruins after the collapse of HypeCoin. The rich and famous are nuts for the latest fad - fresh, human meat.",
                "Two-bit hustlers like you have only one option: get rich off this new addiction before becoming the product.",
                "Use the Subway to nagivate the city's neighborhoods. Buy and sell from the Meat Markets, but watch your back! Gangs run the city, and you don't want to cross them.",
                `You have 24 hours and a ${formatMoney(
                    player.debt,
                )} loan. Hurry up, it's got a 5% hourly interest rate. Welcome to the People's Republic of Los Angeles.`,
            ]}
            buttonLabel={"Start Game"}
            isLoading={isLoading}
            clickCB={handleStartClick}
        />
    );
};
