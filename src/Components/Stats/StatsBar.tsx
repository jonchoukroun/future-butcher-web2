/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const { dispatch, state } = useGameState();

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
                {state.player && formatMoney(state.player.funds)}
            </p>
            <p
                css={{
                    margin: 0,
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.secondary,
                }}
            >
                {state.turnsLeft} H
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
