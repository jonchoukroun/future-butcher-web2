/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useGameState } from "../../GameData/GameStateProvider";

export const MuggingDefeat = ({
    initialTurnsLeft,
}: {
    initialTurnsLeft: number;
}) => {
    const {
        dispatch,
        state: { turnsLeft },
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("State is undefined");

    const hoursLost = initialTurnsLeft - turnsLeft;

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                paddingInline: "10px",
            }}
        >
            <p>
                The mugger kicked your ass. You were out for {hoursLost}{" "}
                {hoursLost > 1 ? "hours" : "hour"}. Better get back out there.
            </p>
            <div
                css={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlockStart: "20px",
                }}
            ></div>
        </div>
    );
};
