/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    Button,
    ButtonScheme,
    ButtonSize,
    ListItemTemplate,
} from "../../Components";
import {
    PackListing,
    PackType,
    WeaponListing,
    WeaponType,
} from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

interface WeaponsListProps {
    transactedItem: PackType | WeaponType | undefined;
    handleModalOpen: <T extends PackListing | WeaponListing>(
        modalProps: T,
    ) => void;
    onStoreBackClick: () => void;
}

export const WeaponsList = ({
    transactedItem,
    handleModalOpen,
    onStoreBackClick,
}: WeaponsListProps) => {
    const {
        state: { store },
    } = useGameState();

    if (store === undefined) throw new Error("State is undefined");

    const { weapons } = store;
    const sortedWeapons = weapons.sort((a, b) => a.price - b.price);

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                css={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBlockStart: "10px",
                    marginBlockEnd: "5px",
                }}
            >
                <Button
                    label={"Browse Packs"}
                    size={ButtonSize.Full}
                    scheme={ButtonScheme.Inverse}
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
                {sortedWeapons.map((listing, idx) => (
                    <ListItemTemplate
                        key={`weapon-${idx}`}
                        listing={listing}
                        transactedItem={transactedItem}
                        isLast={idx === weapons.length - 1}
                        primaryButtonProps={{
                            label: "Details",
                            clickCB: () => handleModalOpen(listing),
                        }}
                    />
                ))}
            </ul>
        </div>
    );
};
