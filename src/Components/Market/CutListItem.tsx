/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionMode } from "./TransactionModal";
import { Button, ButtonScheme, ButtonSize } from "../Form";
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
    onTransactionSelect,
}: CutListItemProps) => {
    const {
        state: { pack, player, spaceAvailable },
    } = useGameState();
    if (
        pack === undefined ||
        player === undefined ||
        spaceAvailable === undefined
    ) {
        throw new Error("State is undefined");
    }

    const canBuy = player.funds >= price && spaceAvailable > 0;
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
                    borderStyle: "dashed",
                    borderWidth: "2px",
                }}
            >
                <h2
                    css={{
                        margin: 0,
                        marginBlockEnd: "5px",
                        color:
                            canBuy || owned > 0
                                ? Colors.Text.base
                                : Colors.Text.disable,
                        textTransform: "capitalize",
                    }}
                >
                    {name}
                </h2>
                <h2
                    css={{
                        margin: 0,
                        color:
                            canBuy || owned > 0
                                ? Colors.Text.base
                                : Colors.Text.disable,
                    }}
                >
                    {formatMoney(price)}
                </h2>
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {owned > 0 && <h4 css={{ margin: 0 }}>Owned: {owned}</h4>}
                <div
                    css={{
                        marginInlineStart: "auto",
                        "& > button:first-of-type": { marginInlineEnd: "32px" },
                    }}
                >
                    <Button
                        scheme={
                            canBuy ? ButtonScheme.Inverse : ButtonScheme.Hidden
                        }
                        size={ButtonSize.Compact}
                        label={"> Buy"}
                        clickCB={() => onTransactionSelect("buy", name)}
                    />

                    <Button
                        scheme={
                            owned > 0
                                ? ButtonScheme.Inverse
                                : ButtonScheme.Hidden
                        }
                        size={ButtonSize.Compact}
                        label={"> Sell"}
                        clickCB={() => onTransactionSelect("sell", name)}
                    />
                </div>
            </div>
        </li>
    );
};
