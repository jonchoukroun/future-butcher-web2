/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components";
import { OwnedCutsType, CutType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";

interface MuggingBribeProps {
    initialFunds: number;
    initialPack: OwnedCutsType;
}

export const MuggingBribe = ({
    initialFunds,
    initialPack,
}: MuggingBribeProps) => {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { funds, pack } = player;

    const content = [
        "Ever the pacifist, you bribe the mugger not to hurt you.",
    ];

    const lostCash = initialFunds - funds;
    const lostCut = Object.entries(initialPack).find(
        ([cut, amount]) => amount > 0 && pack[cut as CutType] === 0,
    );
    if (lostCash) {
        content.push(`You paid the mugger ${formatMoney(lostCash)}.`);
        content.push(
            "Your wallet is lighter but you didn't waste any time bleeding. You can make up this loss.",
        );
    } else if (lostCut) {
        const [cut, amount] = lostCut;
        content.push(
            `You gave the mugger ${amount} ${pluralize(amount)} of ${cut}.`,
        );
        content.push(
            `That's all the ${cut} you owned, but at least you're still in one piece.`,
        );
    }

    const handleClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Market });
    };

    return (
        <ScreenTemplate
            title={"You Played It Safe"}
            content={content}
            primaryButtonLabel={"Get back to work"}
            primaryIsLoading={false}
            primaryClickCB={handleClick}
        />
    );
};

function pluralize(amount: number): "lb" | "lbs" {
    if (amount === 1) return "lb";
    return "lbs";
}
