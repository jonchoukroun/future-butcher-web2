/** @jsx jsx */
import { jsx } from "@emotion/react";

import { PackModalState } from "./SurplusStore";
import { ButtonPrompt, ButtonPromptSize } from "../../Components/ButtonPrompt";
import { PackDetails } from "../../Fixtures/store";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";

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
                    {PackDetails[name].name}
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
                <h4 css={{ margin: 0 }}>Capacity: {packSpace} lbs</h4>

                <ButtonPrompt
                    label={isOwned ? "Owned" : "Buy"}
                    size={ButtonPromptSize.Compact}
                    blink={false}
                    disabled={!canAfford || isOwned}
                    clickCB={() => onModalOpen({ name, packSpace, price })}
                />
            </div>
        </li>
    );
};
