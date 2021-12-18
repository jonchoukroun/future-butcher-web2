/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
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
                    color: Colors.Text.secondary,
                }}
            >
                {player && formatMoney(player.funds)}
            </p>
            <p
                css={{
                    margin: 0,
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.secondary,
                }}
            >
                {turnsLeft && getTimeLeft(turnsLeft)}
            </p>
            <ButtonPrimary
                type={"Small"}
                label={"Stats"}
                border={"Thin"}
                clickCB={() =>
                    dispatch({ type: "changeScreen", screen: Screen.Stats })
                }
            />
        </div>
    );
};
