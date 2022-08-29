/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionType } from "./MarketModal";
import { ListItemTemplate } from "../../Components";
import { TransactionRecordType } from "../../Components/ListItemTemplate";
import { MarketListing, CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";

interface CutListItemProps {
    listing: MarketListing;
    isLast: boolean;
    transactionRecord: TransactionRecordType;
    onTransactionSelect: (transaction: TransactionType, cut: CutType) => void;
}

export const CutListItem = ({
    listing,
    isLast,
    transactionRecord,
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { cash, pack, totalPackSpace } = player;
    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });
    const canBuy = cash >= listing.price && spaceAvailable > 0;
    const owned = pack[listing.name];
    const inStock = listing.quantity > 0;

    return (
        <ListItemTemplate
            listing={listing}
            isLast={isLast}
            transactionRecord={transactionRecord}
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
