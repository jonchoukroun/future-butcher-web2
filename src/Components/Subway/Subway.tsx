/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { useGameState } from "../GameState/GameStateProvider";

interface SubwayProps {
    contentSize: {
        blockSize: number;
        inlineSize: number;
    };
}

export const Subway = ({
    contentSize: { blockSize, inlineSize },
}: SubwayProps) => {
    const { currentStation } = useGameState();

    return (
        <div
            css={css({
                blockSize,
                inlineSize,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
        >
            <h3>{currentStation}</h3>
        </div>
    );
};
