export type PackType =
    | "mini_fridge"
    | "shopping_cart"
    | "suitcase"
    | "wheelbarrow";

export type PackListingType = { pack_space: number; price: number };

export type WeaponType =
    | "box_cutter"
    | "brass_knuckles"
    | "hedge_clippers"
    | "hockey_stick"
    | "machete";

export type WeaponListingType = {
    damage: number;
    price: number;
    can_harvest: boolean;
};

export type StoreType = {
    [Key in PackType | WeaponType]: Key extends PackType
        ? PackListingType
        : WeaponListingType;
};

export interface PackListing extends PackListingType {
    name: PackType;
}
export interface WeaponListing extends WeaponListingType {
    name: WeaponType;
}
export type StoreListing = {
    packs: PackListing[];
    weapons: WeaponListing[];
};

export function isPackListingType(item: PackListingType | WeaponListingType) {
    return "pack_space" in item;
}
