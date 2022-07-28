/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    ButtonPrompt,
    ButtonPromptSize,
    SingleButtonListItem,
} from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";

const Packs = ["mini_fridge", "shopping_cart", "suitcase", "wheelbarrow"];

export const PacksList = ({
    handleModalOpen,
    onStoreBackClick,
}: {
    handleModalOpen: <T extends StorePackType | StoreWeaponType>(
        modalProps: T,
    ) => void;
    onStoreBackClick: () => void;
}) => {
    const {
        state: { store },
    } = useGameState();

    if (store === undefined) throw new Error("State is undefined");

    const packs = (Object.entries(store).filter(
        ([item]) => Packs.indexOf(item) >= 0,
    ) as PackListings).sort(
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
                {packs.map((listing, idx) => (
                    <SingleButtonListItem
                        key={`pack-${idx}`}
                        listing={listing}
                        isLast={idx === packs.length - 1}
                        onModalOpen={handleModalOpen}
                    />
                ))}
            </ul>
        </div>
    );
};
