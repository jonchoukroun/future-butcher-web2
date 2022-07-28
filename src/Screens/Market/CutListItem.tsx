/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionMode } from "./TransactionModal";
import { ListItemTemplate } from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";

interface CutListItemProps {
    name: CutName;
    price: number;
    quantity: number;
    isLast: boolean;
    onTransactionSelect: (mode: TransactionMode, cut?: string) => void;
}

export const CutListItem = ({
    name,
    price,
    isLast,
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { market, pack, player, spaceAvailable },
    } = useGameState();
    if (
        market === undefined ||
        pack === undefined ||
        player === undefined ||
        spaceAvailable === undefined
    ) {
        throw new Error("State is undefined");
    }

    const canBuy = player.funds >= price && spaceAvailable > 0;
    const owned = pack[name];

    return (
        <ListItemTemplate
            itemName={name}
            price={price}
            isLast={isLast}
            rightButtonLabel={"Buy"}
            isRightButtonDisabled={!canBuy}
            rightButtonCB={() => onTransactionSelect("buy", name)}
            leftButtonLabel={"Sell"}
            isLeftButtonDisabled={owned === 0}
            leftButtonCB={() => onTransactionSelect("sell", name)}
        />
    );
};
