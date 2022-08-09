/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    Button,
    ButtonScheme,
    ButtonSize,
    ListItemTemplate,
} from "../../Components";
import { TransactionRecordType } from "../../Components/ListItemTemplate";
import { PackListing, WeaponListing } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

interface PacksListProps {
    transactionRecord: TransactionRecordType;
    handleModalOpen: <T extends PackListing | WeaponListing>(
        modalProps: T,
    ) => void;
    onStoreBackClick: () => void;
}

export const PacksList = ({
    transactionRecord,
    handleModalOpen,
    onStoreBackClick,
}: PacksListProps) => {
    const {
        state: { store },
    } = useGameState();

    if (store === undefined) throw new Error("State is undefined");

    const { packs } = store;
    const sortedPacks = packs.sort((a, b) => a.pack_space - b.pack_space);

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
                {sortedPacks.map((listing, idx) => (
                    <ListItemTemplate
                        key={`pack-${idx}`}
                        listing={listing}
                        isLast={idx === packs.length - 1}
                        transactionRecord={transactionRecord}
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
