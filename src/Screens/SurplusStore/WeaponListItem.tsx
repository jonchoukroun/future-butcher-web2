/** @jsx jsx */
import { jsx } from "@emotion/react";

import { WeaponModalState } from "./SurplusStore";
import { ButtonPrompt, ButtonPromptSize } from "../../Components/ButtonPrompt";
import { WeaponDetails } from "../../Fixtures/store";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";

interface WeaponListItemProps {
    name: WeaponName;
    cuts: CutName[];
    damage: number;
    price: number;
    onModalOpen: (modalProps: WeaponModalState) => void;
}

export const WeaponListItem = ({
    name,
    cuts,
    damage,
    price,
    onModalOpen,
}: WeaponListItemProps) => {
    const {
        state: { pack, player },
    } = useGameState();
    if (pack === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const canAfford = player.funds >= price;
    const isUnarmed = !player.weapon;
    const isOwned = name === player.weapon;
    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                borderColor: "transparent",
                borderBlockEndColor: Colors.Border.subtle,
                borderStyle: "dashed",
                borderWidth: "2px",
            }}
        >
            <div
                css={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlockEnd: "5px",
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
                    {WeaponDetails[name].name}
                </h2>

                <h2
                    css={{
                        marginBlock: 0,
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
                <h4 css={{ margin: 0 }}>Damage {damage}</h4>

                <ButtonPrompt
                    label={isOwned ? "Owned" : isUnarmed ? "Buy" : "Trade"}
                    size={ButtonPromptSize.Compact}
                    blink={false}
                    disabled={!canAfford || isOwned}
                    clickCB={() => onModalOpen({ name, cuts, damage, price })}
                />
            </div>
        </li>
    );
};
