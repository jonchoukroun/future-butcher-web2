/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useGameState } from "../GameState/GameStateProvider";
import { formatMoney } from "../Utils/formatMoney";
import * as Colors from "../../Styles/colors";

export const StatsScreen = () => {
    const { playerStats, turnsLeft } = useGameState();

    return (
        <div
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                paddingBlock: "20px",
                paddingInline: "16px",
                "& p": {
                    marginBlockEnd: 0,
                },
                "& small": {
                    color: Colors.Text.secondary,
                },
            }}
        >
            <div
                css={{
                    paddingBlockEnd: "20px",
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <div
                    css={{
                        paddingBlockEnd: "5px",
                        borderColor: "transparent",
                        borderBlockEndColor: Colors.Border.subtle,
                        borderStyle: "solid",
                        borderWidth: "1px",
                    }}
                >
                    <h3 css={{ marginBlock: 0 }}>Name: {playerStats.name}</h3>
                </div>

                <p>Health: {playerStats.health}</p>
                <small>
                    <em>
                        If this drops to zero, you&apos;re dead! Get patched up
                        at the Free Clinic in Venice Beach.
                    </em>
                </small>

                <p>Cash: {formatMoney(playerStats.cash)}</p>
                <small>
                    <em>
                        Keep hustling to grow this sum, but don&apos;t lost it
                        to a mugger.
                    </em>
                </small>

                <p css={{ color: Colors.Text.danger }}>
                    Debt: {formatMoney(playerStats.debt)}
                </p>
                <small>
                    <em>
                        Don&apos;t let the interest get out of hand. It grows at
                        5% each hour.
                    </em>
                </small>
            </div>

            <div>
                <p>Hours left: {turnsLeft}</p>
                <small>
                    <em>When your turns run out, the game is over.</em>
                </small>
            </div>
        </div>
    );
};
