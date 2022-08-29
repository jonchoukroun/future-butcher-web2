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
        state: { player, turnsLeft },
    } = useGameState();
    if (player === undefined || turnsLeft === undefined) {
        throw new Error("State is undefined");
    }

    const handleClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
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
