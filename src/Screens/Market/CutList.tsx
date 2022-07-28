/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutListItem } from "./CutListItem";
import { TransactionMode } from "./TransactionModal";
import { useGameState } from "../../GameData/GameStateProvider";

export const CutList = ({
    handleTransactionMode,
}: {
    handleTransactionMode: (mode: TransactionMode, cut?: string) => void;
}) => {
    const {
        state: { market },
    } = useGameState();

    if (market === undefined) {
        throw new Error("State is undefined");
    }

    const marketEntries = Object.entries(market);

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
            {marketEntries.map(([name, { price, quantity }], idx) => (
                <CutListItem
                    key={`${name}-${idx}`}
                    name={name as CutName}
                    price={price}
                    quantity={quantity}
                    isLast={idx === marketEntries.length - 1}
                    onTransactionSelect={handleTransactionMode}
                />
            ))}
        </ul>
    );
};
