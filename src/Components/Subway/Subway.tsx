/** @jsx jsx */
import { css, jsx } from "@emotion/react";

import { useGameState } from "../GameState/GameStateProvider";
import { useWindowSize } from "../Window/WindowSizeProvider";

export const Subway = () => {
    const { currentStation } = useGameState();

    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

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
