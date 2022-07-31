/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useState } from "react";

import { PacksList } from "./PacksList";
import { StoreIntro } from "./StoreIntro";
import { StoreModal } from "./StoreModal";
import { WeaponsList } from "./WeaponsList";
import { LineSize, PrintLine } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { PackListing, WeaponListing } from "../../GameData";

import * as Colors from "../../Styles/colors";
import { isPackListingType } from "../../GameData/Store";

export const SurplusStore = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize } = getContentSize();

    const [menuType, setMenuType] = useState<"packs" | "weapons" | undefined>(
        undefined,
    );

    const [packModalState, setPackModalState] = useState<PackListing>();
    const handlePackModalClose = () => setPackModalState(undefined);

    const [weaponModalState, setWeaponModalState] = useState<WeaponListing>();
    const handleWeaponModalClose = () => setWeaponModalState(undefined);

    const handleModalOpen = <ModalState extends PackListing | WeaponListing>(
        state: ModalState,
    ) => {
        if (state === undefined) return;

        if (isPackListingType(state)) {
            setPackModalState(state as PackListing);
        } else {
            setWeaponModalState(state as WeaponListing);
        }
    };

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingInline: "10px",
            }}
        >
            {menuType === undefined && (
                <div
                    css={{
                        inlineSize: "100%",
                        marginBlockStart: "30px",
                        marginBlockEnd: "48px",
                        borderBottomColor: Colors.Border.subtle,
                        borderBottomStyle: "dashed",
                        borderBottomWidth: "2px",
                    }}
                >
                    <PrintLine
                        text={"Gus's Army Surplus"}
                        size={LineSize.Title}
                        prompt={"hidden"}
                    />
                </div>
            )}

            {menuType === undefined ? (
                <StoreIntro
                    onSeeWeaponsClick={() => setMenuType("weapons")}
                    onSeePacksClick={() => setMenuType("packs")}
                />
            ) : menuType === "packs" ? (
                <Fragment>
                    <PacksList
                        handleModalOpen={handleModalOpen}
                        onStoreBackClick={() => setMenuType("weapons")}
                    />
                    {packModalState && (
                        <StoreModal
                            listing={packModalState}
                            onModalClose={handlePackModalClose}
                        />
                    )}
                </Fragment>
            ) : (
                <Fragment>
                    <WeaponsList
                        handleModalOpen={handleModalOpen}
                        onStoreBackClick={() => setMenuType("packs")}
                    />
                    {weaponModalState && (
                        <StoreModal
                            listing={weaponModalState}
                            onModalClose={handleWeaponModalClose}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};
