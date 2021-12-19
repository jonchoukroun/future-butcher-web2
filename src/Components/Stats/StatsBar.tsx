/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

import { formatMoney, getTimeLeft } from "../Utils";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const {
        dispatch,
        state: { player, turnsLeft },
    } = useGameState();

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
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.base,
                }}
            >
                {player && formatMoney(player.funds)}
            </p>
            <p
                css={{
                    margin: 0,
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.base,
                }}
            >
                {turnsLeft && getTimeLeft(turnsLeft)}
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
                    fontFamily: "Share Tech Mono",
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
