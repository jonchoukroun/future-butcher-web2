/** @jsx jsx */
import { jsx } from "@emotion/react";

import { PackListItem } from "./PackListItem";
import { PackModalState } from "./SurplusStore";
import { ButtonPrompt, ButtonPromptSize } from "../../Components/ButtonPrompt";
import { useGameState } from "../../GameData/GameStateProvider";

const Packs = ["mini_fridge", "shopping_cart", "suitcase", "wheelbarrow"];

export const PacksList = ({
    handleModalOpen,
    onStoreBackClick,
}: {
    handleModalOpen: (modalProps: PackModalState) => void;
    onStoreBackClick: () => void;
}) => {
    const {
        state: { store },
    } = useGameState();

    if (store === undefined) throw new Error("State is undefined");

    const packs = (Object.entries(store).filter(
        ([item]) => Packs.indexOf(item) >= 0,
    ) as PackListing).sort(
        ([, propsA], [, propsB]) => propsB.pack_space - propsA.pack_space,
    );

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div css={{ display: "flex", justifyContent: "flex-end" }}>
                <ButtonPrompt
                    label={"Browse Weapons"}
                    size={ButtonPromptSize.Small}
                    blink={false}
                    clickCB={onStoreBackClick}
                />
            </div>

            <ul
                css={{
                    blockSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                    margin: 0,
                    padding: 0,
                    listStyleType: "none",
                }}
            >
                {packs.map(([name, { pack_space, price }], idx) => (
                    <PackListItem
                        key={`${name}-${idx}`}
                        name={name as PackName}
                        packSpace={pack_space}
                        price={price}
                        onModalOpen={handleModalOpen}
                    />
                ))}
            </ul>
        </div>
    );
};
