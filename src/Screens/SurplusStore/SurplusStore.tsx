/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useEffect, useState } from "react";

import { PacksList } from "./PacksList";
import { StoreIntro } from "./StoreIntro";
import { StoreModal } from "./StoreModal";
import { WeaponsList } from "./WeaponsList";
import { LineSize, PrintLine, PromptScheme } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { PackListing, WeaponListing } from "../../GameData";

import * as Colors from "../../Styles/colors";
import { isPackListingType, PackType, WeaponType } from "../../GameData/Store";

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

    const [transactedItem, setTransactedItem] = useState<
        PackType | WeaponType
    >();
    const handleTransactionSuccess = (item: PackType | WeaponType) =>
        setTransactedItem(item);
    useEffect(() => {
        const interval = setInterval(() => {
            if (transactedItem) setTransactedItem(undefined);
        }, 1000);

        return () => clearInterval(interval);
    }, [transactedItem]);

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
                        promptScheme={PromptScheme.Hidden}
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
                        transactedItem={transactedItem}
                        handleModalOpen={handleModalOpen}
                        onStoreBackClick={() => setMenuType("weapons")}
                    />
                    {packModalState && (
                        <StoreModal
                            listing={packModalState}
                            onModalClose={handlePackModalClose}
                            onTransactionSuccess={handleTransactionSuccess}
                        />
                    )}
                </Fragment>
            ) : (
                <Fragment>
                    <WeaponsList
                        transactedItem={transactedItem}
                        handleModalOpen={handleModalOpen}
                        onStoreBackClick={() => setMenuType("packs")}
                    />
                    {weaponModalState && (
                        <StoreModal
                            listing={weaponModalState}
                            onModalClose={handleWeaponModalClose}
                            onTransactionSuccess={handleTransactionSuccess}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};
