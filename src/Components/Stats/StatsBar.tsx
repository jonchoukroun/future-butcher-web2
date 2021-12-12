/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { player } from "../../Fixtures/player";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const { dispatch } = useGameState();
    const turnsLeft = 24;

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
                {formatMoney(player.cash)}
            </p>
            <p
                css={{
                    margin: 0,
                    fontFamily: "Share Tech Mono",
                    color: Colors.Text.secondary,
                }}
            >
                {turnsLeft} H
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
