/** @jsx jsx */
import { jsx } from "@emotion/react";

import {
    ButtonPrompt,
    ButtonPromptSize,
    ListItemTemplate,
} from "../../Components";
import { useGameState } from "../../GameData/GameStateProvider";
import { PackListing, WeaponListing } from "../../GameData";

export const WeaponsList = ({
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

    const { weapons } = store;

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
                    <ListItemTemplate
                        key={`weapon-${idx}`}
                        listing={listing}
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
