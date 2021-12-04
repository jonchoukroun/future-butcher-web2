/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { useGameState } from "../GameState/GameStateProvider";
import { formatMoney } from "../Utils/formatMoney";
import * as Colors from "../../Styles/colors";

export const StatsBar = () => {
    const { playerStats } = useGameState();

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
                    color: Colors.Text.secondary,
                }}
            >
                {formatMoney(playerStats.cash)}
            </p>
            <ButtonPrimary
                type={"Sized"}
                label={"Stats"}
                clickCB={() => {
                    return;
                }}
            />
        </div>
    );
};
