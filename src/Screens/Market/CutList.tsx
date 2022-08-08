/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutListItem } from "./CutListItem";
import { useGameState } from "../../GameData/GameStateProvider";
import { TransactionType } from "./MarketModal";
import { CutType } from "../../GameData";

interface CutListProps {
    transactedCut: CutType | undefined;
    handleTransactionSelect: (
        transaction: TransactionType,
        cut: CutType,
    ) => void;
}

export const CutList = ({
    transactedCut,
    handleTransactionSelect,
}: CutListProps) => {
    const {
        state: { market },
    } = useGameState();

    if (market === undefined) {
        throw new Error("State is undefined");
    }

    return (
        <ul
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
                margin: 0,
                padding: 0,
                listStyleType: "none",
            }}
        >
            {market.map((listing, idx) => (
                <CutListItem
                    key={`${name}-${idx}`}
                    listing={listing}
                    transactedCut={transactedCut}
                    isLast={idx === market.length - 1}
                    onTransactionSelect={handleTransactionSelect}
                />
            ))}
        </ul>
    );
};
