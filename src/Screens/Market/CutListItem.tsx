/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionType } from "./MarketModal";
import { ListItemTemplate } from "../../Components";
import { MarketListing, CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

interface CutListItemProps {
    listing: MarketListing;
    isLast: boolean;
    onTransactionSelect: (transaction: TransactionType, cut: CutType) => void;
}

export const CutListItem = ({
    listing: { name, price },
    isLast,
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { market, player },
    } = useGameState();
    if (market === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const { pack } = player;

    // FIXME: compute spaceAvailable
    const spaceAvailable = 20;
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
