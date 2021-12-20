/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

interface CutListItemProps {
    name: string;
    price: number;
    quantity: number;
}

export const CutListItem = ({ name, price, quantity }: CutListItemProps) => {
    const {
        state: { player },
    } = useGameState();
    const canAfford = player && player.funds >= price;

    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <div
                css={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlockEnd: "5px",
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <h3
                    css={{
                        margin: 0,
                        marginBlockEnd: "5px",
                        color: canAfford
                            ? Colors.Text.base
                            : Colors.Text.subtle,
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                    }}
                >
                    {name}
                </h3>
                <p
                    css={{
                        marginBlock: 0,
                        color: canAfford
                            ? Colors.Text.subtle
                            : Colors.Text.disable,
                    }}
                >
                    Stock: {quantity}
                </p>
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    "& > button": {
                        marginInlineStart: "8px",
                    },
                }}
            >
                <h3
                    css={{
                        margin: 0,
                        marginInlineEnd: "10px",
                        fontFamily: "Share Tech Mono",
                        color: canAfford
                            ? Colors.Text.base
                            : Colors.Text.subtle,
                    }}
                >
                    {formatMoney(price)}
                </h3>
                <ButtonPrimary
                    label={"Buy"}
                    type={"Half"}
                    border={"Thin"}
                    isDisabled={!canAfford}
                    clickCB={() => {
                        return;
                    }}
                />
                <ButtonPrimary
                    label={"Sell"}
                    type={"Half"}
                    border={"Thin"}
                    isDisabled={true}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>
        </li>
    );
};
