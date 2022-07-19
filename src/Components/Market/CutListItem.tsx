/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionMode } from "./TransactionModal";
import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

interface CutListItemProps {
    name: CutName;
    price: number;
    quantity: number;
    onTransactionSelect: (mode: TransactionMode, cut?: string) => void;
}

export const CutListItem = ({
    name,
    price,
    quantity,
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { pack, player, spaceAvailable },
    } = useGameState();
    if (pack === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const canAfford = player.funds >= price;

    const owned = pack[name];

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
                <div css={{ display: "flex" }}>
                    {owned > 0 && (
                        <p
                            css={{
                                marginBlock: 0,
                                marginInlineEnd: "10px",
                                color: canAfford
                                    ? Colors.Text.base
                                    : Colors.Text.disable,
                            }}
                        >
                            Owned: {owned}
                        </p>
                    )}
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
                    isDisabled={!canAfford || spaceAvailable === 0}
                    clickCB={() => onTransactionSelect("buy", name)}
                />
                <ButtonPrimary
                    label={"Sell"}
                    type={"Half"}
                    border={"Thin"}
                    isDisabled={owned === 0}
                    clickCB={() => onTransactionSelect("sell", name)}
                />
            </div>
        </li>
    );
};
