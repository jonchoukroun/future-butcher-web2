/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    ButtonPrompt,
    ButtonPromptSize,
    SingleButtonListItem,
} from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";

const Weapons = [
    "box_cutter",
    "brass_knuckles",
    "hedge_clippers",
    "hockey_stick",
    "machete",
];

export const WeaponsList = ({
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

    const weapons = (Object.entries(store).filter(
        ([item]) => Weapons.indexOf(item) >= 0,
    ) as WeaponListings).sort(
        ([, propsA], [, propsB]) => propsB.price - propsA.price,
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
                    label={"Browse Packs"}
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
                {weapons.map((listing, idx) => (
                    <SingleButtonListItem
                        key={`weapon-${idx}`}
                        listing={listing}
                        isLast={idx === weapons.length - 1}
                        onModalOpen={handleModalOpen}
                    />
                ))}
            </ul>
        </div>
    );
};
