/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { getVictoryCopy } from "../../Copy/Mugging";
import { WeaponDetails } from "../../Fixtures/store";
import { OwnedCutsType, CutType, Screen, WeaponType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

interface MuggingVictoryProps {
    initialHealth: number;
    initialPack: OwnedCutsType;
}

export const MuggingVictory = ({
    initialHealth,
    initialPack,
}: MuggingVictoryProps) => {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { health, pack, weapon } = player;

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

    const content = [getVictoryCopy(weapon === null)];
    if (initialHealth > health) {
        if (weapon === null) {
            content.push(
                `You didn't escape unscathed. The mugger sliced you for ${
                    initialHealth - health
                } damage.`,
            );
        } else {
            content.push(
                `The mugger got some good hits in and you took ${
                    initialHealth - health
                } damage.`,
            );
        }
        if (health < 50) {
            content.push(
                "You're getting weak. Visit the 24 Hour Clinic in Venice Beach to get patched up.",
            );
        }
    }
    if (cutsCount > 0) {
        content.push(
            ...[
                `You pull out your trusty ${
                    WeaponDetails[player.weapon as WeaponType].displayName
                } and get slicing.`,
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
            primaryButtonLabel={"Get back to work"}
            primaryIsLoading={false}
            primaryClickCB={handleClick}
        />
    );
};
