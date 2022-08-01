/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

export const MuggingDefeat = ({
    initialTurnsLeft,
}: {
    initialTurnsLeft: number;
}) => {
    const {
        dispatch,
        state: { turnsLeft },
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("State is undefined");

    const handleClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
    };

    const hoursLost = initialTurnsLeft - turnsLeft;

    const muggingContent = [
        "The mugger kicked your ass!",
        `You lay unconscious in the gutter for ${hoursLost} ${pluralize(
            hoursLost,
        )} while local kids threw rocks at your sorry ass.`,
        "Next time, bring a better weapon to the fight.",
    ];

    return (
        <ScreenTemplate
            title={"You lose!"}
            danger={true}
            content={muggingContent}
            isLoading={false}
            buttonLabel={"Get back to work"}
            clickCB={handleClick}
        />
    );
};

function pluralize(time: number): string {
    return time === 1 ? "hour" : "hours";
}
