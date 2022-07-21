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
                        color: Colors.Text.base,
                        textTransform: "capitalize",
                    }}
                >
                    {name}
                </h2>
                <h2
                    css={{
                        margin: 0,
                        color: Colors.Text.base,
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
                        display: "flex",
                        marginInlineStart: "auto",
                    }}
                >
                    <div
                        css={{
                            display: "flex",
                            alignItems: "center",
                            marginInlineEnd: "32px",
                        }}
                    >
                        <h4
                            css={{
                                marginBlock: 0,
                                marginInlineEnd: "10px",
                                opacity: canBuy ? 1 : 0,
                            }}
                        >
                            {">"}
                        </h4>
                        <Button
                            scheme={ButtonScheme.Inverse}
                            size={ButtonSize.Compact}
                            label={"Buy"}
                            isDisabled={!canBuy}
                            clickCB={() => onTransactionSelect("buy", name)}
                        />
                    </div>

                    <div css={{ display: "flex", alignItems: "center" }}>
                        <h4
                            css={{
                                marginBlock: 0,
                                marginInlineEnd: "10px",
                                opacity: owned > 0 ? 1 : 0,
                            }}
                        >
                            {">"}
                        </h4>
                        <Button
                            scheme={ButtonScheme.Inverse}
                            size={ButtonSize.Compact}
                            label={"Sell"}
                            isDisabled={owned === 0}
                            clickCB={() => onTransactionSelect("sell", name)}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
};
