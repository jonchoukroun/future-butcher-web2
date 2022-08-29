/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";
import { getTimeLeft } from "../../Utils/getTimeLeft";

import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const {
        dispatch,
        state: { player, turnsLeft },
    } = useGameState();

    if (player === undefined || turnsLeft === undefined) {
        throw new Error("State is undefined");
    }

    const { cash, debt, health } = player;

    const handleClick = () =>
        dispatch({ type: "changeScreen", screen: Screen.Stats });

    return (
        <button
            css={{
                blockSize: "40px",
                inlineSize: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBlock: "2px",
                paddingInline: "16px",
                backgroundColor: "transparent",
                borderColor: "transparent",
                borderBlockEndColor: Colors.Border.subtle,
                borderRadius: "0px",
                borderStyle: "solid",
                borderWidth: "1px",
            }}
            onClick={handleClick}
        >
            <h4
                css={{
                    margin: 0,
                    color: Colors.Text.base,
                }}
            >
                {formatMoney(cash)}
                {debt > 0 && <span css={{ color: Colors.Text.danger }}>!</span>}
            </h4>

            <h4
                css={{
                    margin: 0,
                    color:
                        turnsLeft >= 5 ? Colors.Text.base : Colors.Text.danger,
                }}
            >
                {getTimeLeft(turnsLeft)}
            </h4>

            <h4
                css={{
                    margin: 0,
                    color:
                        turnsLeft >= 5 ? Colors.Text.base : Colors.Text.danger,
                }}
            >
                Health: {health}%
            </h4>
        </button>
    );
};
