import { PackType, WeaponType } from "../GameData";

export const PackDetails: {
    [Pack in PackType | "backpack"]: {
        description: string;
        displayName: string;
        packSpace: number;
    };
} = {
    backpack: {
        description:
            "Lot's of patches. It's too many, really. Especially that anarchy one.",
        displayName: "Backpack",
        packSpace: 20,
    },
    mini_fridge: {
        description:
            "A funky smelling college dorm fridge, strapped to a skateboard.",
        displayName: "Mini Fridge",
        packSpace: 60,
    },
    shopping_cart: {
        description: "A SuperRalphs cart with one wheel locked at an angle.",
        displayName: "Shopping Cart",
        packSpace: 50,
    },
    suitcase: {
        description: "Bulgy and patched, with fraying seams.",
        displayName: "Suitcase",
        packSpace: 30,
    },
    wheelbarrow: {
        description:
            "Rusty, squeaky, and wobbly. Low enough to mess up your back.",
        displayName: "Wheelbarrow",
        packSpace: 40,
    },
};

export const WeaponDetails: {
    [Weapon in WeaponType]: { displayName: string; damage: number };
} = {
    box_cutter: { displayName: "Box Cutter", damage: 4 },
    brass_knuckles: { displayName: "Brass Knuckles", damage: 5 },
    hedge_clippers: { displayName: "Hedge Clippers", damage: 6 },
    hockey_stick: { displayName: "Hockey Stick", damage: 8 },
    machete: { displayName: "Machete", damage: 7 },
};
