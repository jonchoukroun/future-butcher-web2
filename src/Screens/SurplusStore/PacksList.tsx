/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    Button,
    ButtonScheme,
    ButtonSize,
    ListItemTemplate,
} from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";
import { PackListing, WeaponListing } from "../../GameData";

export const PacksList = ({
    handleModalOpen,
    onStoreBackClick,
}: {
    handleModalOpen: <T extends PackListing | WeaponListing>(
        modalProps: T,
    ) => void;
    onStoreBackClick: () => void;
}) => {
    const {
        state: { store },
    } = useGameState();

    if (store === undefined) throw new Error("State is undefined");

    const { packs } = store;

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
                    label={"Browse Weapons"}
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
                {packs.map((listing, idx) => (
                    <ListItemTemplate
                        key={`pack-${idx}`}
                        listing={listing}
                        isLast={idx === packs.length - 1}
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
