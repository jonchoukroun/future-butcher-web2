/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useGameState } from "../../GameData/GameStateProvider";
import { handleMessage } from "../../Logging/handleMessage";
import { OwnedCutsType, CutType } from "../../GameData";

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
        handleMessage("Player defeats mugger without a weapon", "error");
    }

    const { pack } = player;

    // const harvestedCuts: string[] = [];
    // Object.entries(pack).forEach(([cut, amount]) => {
    //     const harvested = amount - initialPack[cut as Cuts];
    //     if (harvested > 0) harvestedCuts.push(`${amount} ${cut}`);
    // });
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

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                paddingInline: "10px",
            }}
        >
            <p>Local street kids cheer as you take out the mugger.</p>

            {harvestedCuts.length > 0 && (
                <p>{`With your ${player.weapon}, you harvest his ${harvestedCuts}.`}</p>
            )}

            <div
                css={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlockStart: "20px",
                }}
            >
                <p>FIXME: add button</p>
            </div>
        </div>
    );
};
