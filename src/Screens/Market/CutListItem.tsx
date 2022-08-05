/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionType } from "./MarketModal";
import { ListItemTemplate } from "../../Components";
import { MarketListing, CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";
import { CutSurge } from "../../Fixtures/store";

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

    const { pack, totalPackSpace } = player;

    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });
    const canBuy = player.funds >= listing.price && spaceAvailable > 0;
    const owned = pack[listing.name];

    return (
        <ListItemTemplate
            listing={listing}
            isLast={isLast}
            isSurge={listing.price >= CutSurge[listing.name].price}
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
