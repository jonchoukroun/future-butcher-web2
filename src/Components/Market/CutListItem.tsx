/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { CutType } from "../../Fixtures/marketCuts";
import { player } from "../../Fixtures/player";
import * as Colors from "../../Styles/colors";

interface CutListItemProps {
    cut: CutType;
}

export const CutListItem = ({ cut }: CutListItemProps) => {
    const canAfford = player.cash >= cut.price;

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
                        textTransform: "capitalize",
                        color: canAfford
                            ? Colors.Text.primary
                            : Colors.Text.secondary,
                    }}
                >
                    {cut.name}
                </h3>
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
                            ? Colors.Text.primary
                            : Colors.Text.danger,
                    }}
                >
                    {formatMoney(cut.price)}
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
