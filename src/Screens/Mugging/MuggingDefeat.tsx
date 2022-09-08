/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { getDefeatCopy } from "../../Copy/Mugging";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

export const MuggingDefeat = ({
    initialHealth,
    initialTurnsLeft,
}: {
    initialHealth: number;
    initialTurnsLeft: number;
}) => {
    const {
        dispatch,
        state: { currentStation, player, turnsLeft },
    } = useGameState();
    if (
        currentStation === undefined ||
        player === undefined ||
        turnsLeft === undefined
    ) {
        throw new Error("State is undefined");
    }

    const handleClick = () => {
        const screen =
            currentStation === "venice_beach" ? Screen.Clinic : Screen.Market;
        dispatch({ type: "changeScreen", screen });
    };

    const hoursLost = initialTurnsLeft - turnsLeft;

    const muggingContent = [
        "The mugger kicked your ass!",
        getDefeatCopy(hoursLost, initialHealth - player.health),
        "Next time, bring a better weapon to the fight.",
    ];

    return (
        <ScreenTemplate
            title={"You lose!"}
            danger={true}
            content={muggingContent}
            primaryButtonLabel={"Get back to work"}
            primaryIsLoading={false}
            primaryClickCB={handleClick}
        />
    );
};
