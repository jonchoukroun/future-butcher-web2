/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionType } from "./MarketModal";
import { ListItemTemplate } from "../../Components";
import { MarketListing, CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";

interface CutListItemProps {
    listing: MarketListing;
    isLast: boolean;
    transactedCut: CutType | undefined;
    onTransactionSelect: (transaction: TransactionType, cut: CutType) => void;
}

export const CutListItem = ({
    listing,
    isLast,
    transactedCut,
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { funds, pack, totalPackSpace } = player;
    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });
    const canBuy = funds >= listing.price && spaceAvailable > 0;
    const owned = pack[listing.name];
    const inStock = listing.quantity > 0;

    return (
        <ListItemTemplate
            listing={listing}
            isLast={isLast}
            transactedItem={transactedCut}
            primaryButtonProps={{
                label: "Buy",
                disabled: !canBuy || !inStock,
                clickCB: () => onTransactionSelect("buy", listing.name),
            }}
            secondaryButtonProps={{
                label: "Sell",
                disabled: owned === 0,
                clickCB: () => onTransactionSelect("sell", listing.name),
            }}
        />
    );
};
