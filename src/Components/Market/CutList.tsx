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
            {market &&
                Object.entries(
                    market,
                ).map(([name, { price, quantity }], idx) => (
                    <CutListItem
                        key={`${name}-${idx}`}
                        name={name}
                        price={price}
                        quantity={quantity}
                        onTransactionSelect={handleTransactionMode}
                    />
                ))}
        </ul>
    );
};
