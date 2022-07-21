/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

import { formatMoney, getTimeLeft } from "../../Utils";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const {
        dispatch,
        state: { player, turnsLeft },
    } = useGameState();

    if (player === undefined || turnsLeft === undefined)
        throw new Error("State is undefined");

    return (
        <div
            css={{
                blockSize: "40px",
                inlineSize: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBlock: "2px",
                paddingInline: "16px",
                borderColor: "transparent",
                borderBlockEndColor: Colors.Border.subtle,
                borderRadius: "0px",
                borderStyle: "solid",
                borderWidth: "1px",
            }}
        >
            <p
                css={{
                    margin: 0,
                    color: Colors.Text.base,
                }}
            >
                {formatMoney(player.funds)}
                {player.debt > 0 && (
                    <span css={{ color: Colors.Text.danger }}>!</span>
                )}
            </p>
            <p
                css={{
                    margin: 0,
                    color:
                        turnsLeft >= 5 ? Colors.Text.base : Colors.Text.danger,
                }}
            >
                {getTimeLeft(turnsLeft)}
            </p>
            <button
                css={{
                    inlineSize: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "2px",
                    backgroundColor: Colors.Background.base,
                    border: "none",
                    color: Colors.Text.base,
                    fontSize: "16px",
                    "& svg": {
                        marginBlockStart: "-10px",
                        marginInlineStart: "4px",
                    },
                }}
                onClick={() =>
                    dispatch({ type: "changeScreen", screen: Screen.Stats })
                }
            >
                INFO
                <FontAwesomeIcon icon={faSortDown} />
            </button>
        </div>
    );
};
