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
    listing,
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
    const canBuy = player.funds >= listing.price && spaceAvailable > 0;
    const owned = pack[listing.name];

    return (
        <ListItemTemplate
            listing={listing}
            isLast={isLast}
            primaryButtonProps={{
                label: "Buy",
                disabled: !canBuy,
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
