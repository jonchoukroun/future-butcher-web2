/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { OwnedCutsType, CutType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";

interface MuggingVictoryProps {
    initialPack: OwnedCutsType;
}

export const MuggingVictory = ({ initialPack }: MuggingVictoryProps) => {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    if (player.weapon === undefined) {
        handleMessage(
            "Player defeats mugger without a weapon",
            MessageLevel.Error,
        );
    }

    const { pack } = player;

    let cutsCount = 0;
    const harvestedCuts: string = Object.entries(pack).reduce(
        (cutsString, [cut, amount]) => {
            if (amount === initialPack[cut as CutType]) return cutsString;

            // First we just include the cut in case it's a single cut harvested
            if (!cutsString.length) {
                cutsCount += 1;
                return cut;
            }

            // This means there will now be 2 cuts, so we throw "and" in there
            if (cutsCount === 1) {
                cutsCount += 1;
                return `${cutsString} and ${cut}`;
            }

            // At this point we can just prepend cuts with commas
            cutsCount += 1;
            return `${cut}, ${cutsString}`;
        },
        "",
    );

    // TODO: add additional responses and randomize
    const content = ["Neighborhood kids cheer as you kick the mugger's ass."];
    if (cutsCount > 0) {
        content.push(
            ...[
                `You pull out your trusty ${player.weapon} and get slicing.`,
                `Nice! You just scored some ${harvestedCuts}...`,
            ],
        );
    }

    const handleClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
    };

    return (
        <ScreenTemplate
            title={"You win!"}
            content={content}
            isLoading={false}
            buttonLabel={"Get back to work"}
            clickCB={handleClick}
        />
    );
};
