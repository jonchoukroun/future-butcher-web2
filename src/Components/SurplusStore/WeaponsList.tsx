/** @jsx jsx */
import { jsx } from "@emotion/react";

import { WeaponModalState } from "./SurplusStore";
import { WeaponListItem } from "./WeaponListItem";
import { useGameState } from "../../GameData/GameStateProvider";
import { ButtonPrimary } from "../Form";

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
    handleModalOpen: (modalProps: WeaponModalState) => void;
    onStoreBackClick: () => void;
}) => {
    const {
        state: { player, store },
    } = useGameState();

    if (player === undefined || store === undefined)
        throw new Error("State is undefined");

    const weapons = (Object.entries(store).filter(
        ([item]) => Weapons.indexOf(item) >= 0,
    ) as WeaponListing).sort(
        ([, propsA], [, propsB]) => propsB.price - propsA.price,
    );

    const ownedWeapon = player.weapon
        ? weapons.find(([name]) => name === player.weapon)
        : undefined;

    const ownedWeaponPrice: number = ownedWeapon ? ownedWeapon[1].price : 0;

    return (
        <div
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
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
                {weapons.map(([name, { cuts, damage, price }], idx) => (
                    <WeaponListItem
                        key={`${name}-${idx}`}
                        name={name as WeaponName}
                        cuts={cuts as CutName[]}
                        damage={damage}
                        price={price - ownedWeaponPrice}
                        onModalOpen={handleModalOpen}
                    />
                ))}
            </ul>
            <div css={{ display: "flex", justifyContent: "flex-start" }}>
                <ButtonPrimary
                    type={"Sized"}
                    label={"Back"}
                    border={"None"}
                    scheme={"Inverse"}
                    clickCB={onStoreBackClick}
                />
            </div>
        </div>
    );
};
