/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useReducer, useState } from "react";

import { PackModal } from "./PackModal";
import { PacksList } from "./PacksList";
import { StoreIntro } from "./StoreIntro";
import { WeaponsList } from "./WeaponsList";
import { WeaponModal } from "./WeaponModal";
import { PrintLine, LineSize } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export type PackModalState = {
    name: PackName | undefined;
    packSpace: number | undefined;
    price: number | undefined;
};

export type WeaponModalState = {
    name: WeaponName | undefined;
    cuts: CutName[] | undefined;
    damage: number | undefined;
    price: number | undefined;
};

export const SurplusStore = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize } = getContentSize();

    const [menuType, setMenuType] = useState<"packs" | "weapons" | undefined>(
        undefined,
    );
    const handleStoreBackClick = () => setMenuType(undefined);

    const buyPackState: PackModalState = {
        name: undefined,
        packSpace: undefined,
        price: undefined,
    };
    const [packState, packDispatch] = useReducer(buyPackReducer, buyPackState);
    const handlePackModalOpen = (modalProps: PackModalState) => {
        packDispatch({ type: "open", props: modalProps });
    };
    const handlePackModalClose = () => packDispatch({ type: "close" });

    const buyWeaponState: WeaponModalState = {
        name: undefined,
        cuts: undefined,
        damage: undefined,
        price: undefined,
    };
    const [weaponState, weaponDispatch] = useReducer(
        buyWeaponReducer,
        buyWeaponState,
    );
    const handleWeaponModalOpen = (modalProps: WeaponModalState) => {
        weaponDispatch({ type: "open", props: modalProps });
    };
    const handleWeaponModalClose = () => weaponDispatch({ type: "close" });

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
                        handleModalOpen={handlePackModalOpen}
                        onStoreBackClick={handleStoreBackClick}
                    />
                    {packState.name &&
                        packState.packSpace &&
                        packState.price && (
                            <PackModal
                                name={packState.name}
                                packSpace={packState.packSpace}
                                price={packState.price}
                                onModalClose={handlePackModalClose}
                            />
                        )}
                </Fragment>
            ) : (
                <Fragment>
                    <WeaponsList
                        handleModalOpen={handleWeaponModalOpen}
                        onStoreBackClick={handleStoreBackClick}
                    />
                    {weaponState.name &&
                        weaponState.cuts !== undefined &&
                        weaponState.damage &&
                        weaponState.price !== undefined && (
                            <WeaponModal
                                name={weaponState.name}
                                cuts={weaponState.cuts}
                                damage={weaponState.damage}
                                price={weaponState.price}
                                onModalClose={handleWeaponModalClose}
                            />
                        )}
                </Fragment>
            )}
        </div>
    );
};

type PackAction = { type: "close" } | { type: "open"; props: PackModalState };

function buyPackReducer(_packState: PackModalState, action: PackAction) {
    if (action.type === "close")
        return {
            name: undefined,
            packSpace: undefined,
            price: undefined,
        };

    return action.props;
}

type WeaponAction =
    | { type: "close" }
    | { type: "open"; props: WeaponModalState };

function buyWeaponReducer(
    _weaponState: WeaponModalState,
    action: WeaponAction,
) {
    if (action.type === "close")
        return {
            name: undefined,
            cuts: undefined,
            damage: undefined,
            price: undefined,
        };

    return action.props;
}
