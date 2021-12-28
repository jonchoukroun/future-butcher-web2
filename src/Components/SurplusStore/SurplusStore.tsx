/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useReducer, useState } from "react";

import { PackModal } from "./PackModal";
import { PacksList } from "./PacksList";
import { WeaponsList } from "./WeaponsList";
import { WeaponModal } from "./WeaponModal";
import { ButtonPrimary } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export type PackModalState = {
    mode: "buy" | "drop" | undefined;
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
    const [menuType, setMenuType] = useState<"packs" | "weapons" | undefined>(
        undefined,
    );
    const handleStoreBackClick = () => setMenuType(undefined);

    const buyPackState: PackModalState = {
        mode: undefined,
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

    const { heightAdjustment, layout } = useWindowSize();
    return (
        <div
            css={{
                blockSize: `calc(100% - ${heightAdjustment}px)`,
                maxBlockSize: "600px",
                display: "flex",
                flexDirection: "column",
                paddingInline: "8px",
            }}
        >
            {layout === "full" && (
                <h2
                    css={{
                        marginBlock: 0,
                        color: Colors.Text.base,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        wordSpacing: "4px",
                    }}
                >
                    Gus&apos; Army Surplus
                </h2>
            )}

            {menuType === undefined ? (
                <Fragment>
                    <p css={{ marginBlock: "40px" }}>
                        Welcome to the last bastion of freedom in LA! We have
                        the best gear to ensure your liberty.
                    </p>

                    <p>You look like you could use more carrying space.</p>
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "center",
                            marginBlockEnd: "40px",
                        }}
                    >
                        <ButtonPrimary
                            type={"Block"}
                            label={"Buy Packs"}
                            scheme={"Inverse"}
                            clickCB={() => setMenuType("packs")}
                        />
                    </div>

                    <p>
                        Ain&apos;t no more 2nd ammendment, but we still have all
                        your personal defense needs.
                    </p>
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "center",
                            marginBlockEnd: "40px",
                        }}
                    >
                        <ButtonPrimary
                            type={"Block"}
                            label={"Buy Weapons"}
                            scheme={"Inverse"}
                            clickCB={() => setMenuType("weapons")}
                        />
                    </div>
                </Fragment>
            ) : menuType === "packs" ? (
                <Fragment>
                    <PacksList
                        handleModalOpen={handlePackModalOpen}
                        onStoreBackClick={handleStoreBackClick}
                    />
                    {packState.mode &&
                        packState.name &&
                        packState.packSpace &&
                        packState.price && (
                            <PackModal
                                mode={packState.mode}
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
            mode: undefined,
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
