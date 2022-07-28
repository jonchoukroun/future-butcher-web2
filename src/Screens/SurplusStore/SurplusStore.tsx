/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useState } from "react";

import { PacksList } from "./PacksList";
import { StoreIntro } from "./StoreIntro";
import { WeaponsList } from "./WeaponsList";
import { LineSize, PrintLine } from "../../Components/PrintLine";
import { TransactionModal } from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const SurplusStore = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize } = getContentSize();

    const [menuType, setMenuType] = useState<"packs" | "weapons" | undefined>(
        undefined,
    );

    const [packModalState, setPackModalState] = useState<StorePackType>();
    const handlePackModalClose = () => setPackModalState(undefined);

    const [weaponModalState, setWeaponModalState] = useState<StoreWeaponType>();
    const handleWeaponModalClose = () => setWeaponModalState(undefined);

    const handleModalOpen = <
        ModalState extends StorePackType | StoreWeaponType
    >(
        state: ModalState,
    ) => {
        // TODO validation
        if ((state as StorePackType)[1].pack_space) {
            setPackModalState(state as StorePackType);
        } else {
            setWeaponModalState(state as StoreWeaponType);
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
                        showPrompt={false}
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
                        <TransactionModal
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
                        <TransactionModal
                            listing={weaponModalState}
                            onModalClose={handleWeaponModalClose}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};
