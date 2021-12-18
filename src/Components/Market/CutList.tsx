/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutListItem } from "./CutListItem";
import { useGameState } from "../../GameData/GameStateProvider";

export const CutList = () => {
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
                    />
                ))}
        </ul>
    );
};
