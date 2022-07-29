import {
    StoreType,
    StoreListing,
    PackType,
    PackListingType,
    WeaponListingType,
    WeaponType,
} from "..";

export function serializeStore(store: StoreType): StoreListing {
    const serializedStore: StoreListing = { packs: [], weapons: [] };

    Object.entries(store).forEach(([itemName, itemDetails]) => {
        if (isPack(itemDetails)) {
            serializedStore.packs.push({
                ...itemDetails,
                name: itemName as PackType,
            });
        } else {
            serializedStore.weapons.push({
                ...itemDetails,
                name: itemName as WeaponType,
            });
        }
    });

    return serializedStore;
}

function isPack(
    item: PackListingType | WeaponListingType,
): item is PackListingType {
    return (item as PackListingType).pack_space !== undefined;
}
