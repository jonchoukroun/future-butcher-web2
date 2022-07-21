/** @jsx jsx */
import { jsx } from "@emotion/react";

import { PackModalState } from "./SurplusStore";
import { ButtonPrimary } from "../../Components";
import { formatMoney } from "../../Utils/formatMoney";
import { PackDetails } from "../../Fixtures/store";
import { useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

interface PackListItemProps {
    name: PackName;
    packSpace: number;
    price: number;
    onModalOpen: (modalProps: PackModalState) => void;
}

export const PackListItem = ({
    name,
    packSpace,
    price,
    onModalOpen,
}: PackListItemProps) => {
    const {
        state: { pack, player },
    } = useGameState();
    if (pack === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const canAfford = player.funds >= price;
    const isOwned = PackDetails[name].packSpace === player.packSpace;
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
                        color: Colors.Text.base,
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                    }}
                >
                    {PackDetails[name].name}
                </h3>

                <p
                    css={{
                        marginBlock: 0,
                        marginInlineEnd: "10px",
                        color: Colors.Text.base,
                    }}
                >
                    {packSpace} lbs
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
                        color: canAfford
                            ? Colors.Text.base
                            : Colors.Text.disable,
                        fontStyle: canAfford ? "normal" : "italic",
                    }}
                >
                    {formatMoney(price)}
                </h3>

                <ButtonPrimary
                    label={isOwned ? "Owned" : "Buy"}
                    type={"Half"}
                    border={isOwned ? "None" : "Thin"}
                    isDisabled={!canAfford || isOwned}
                    clickCB={() => onModalOpen({ name, packSpace, price })}
                />
            </div>
        </li>
    );
};
