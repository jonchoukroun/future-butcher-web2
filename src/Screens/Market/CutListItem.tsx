/** @jsx jsx */
import { jsx } from "@emotion/react";

import { TransactionMode } from "./TransactionModal";
import { ButtonPrompt, ButtonPromptSize } from "../../Components/ButtonPrompt";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";

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
                            marginInlineEnd: "22px",
                        }}
                    >
                        <ButtonPrompt
                            size={ButtonPromptSize.Compact}
                            label={"Buy"}
                            showPrompt={canBuy}
                            blink={false}
                            disabled={!canBuy}
                            clickCB={() => onTransactionSelect("buy", name)}
                        />
                    </div>

                    <ButtonPrompt
                        size={ButtonPromptSize.Compact}
                        label={"Sell"}
                        showPrompt={owned > 0}
                        blink={false}
                        disabled={owned === 0}
                        clickCB={() => onTransactionSelect("sell", name)}
                    />
                </div>
            </div>
        </li>
    );
};
