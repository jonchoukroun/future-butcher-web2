export const PackDetails: Record<
    PackName | "backpack",
    { description: string; name: string; packSpace: number }
> = {
    backpack: {
        description:
            "Lot's of patches. It's too many, really. Especially that anarchy one.",
        name: "Backpack",
        packSpace: 20,
    },
    mini_fridge: {
        description:
            "A funky smelling college dorm fridge, strapped to a skateboard.",
        name: "Mini Fridge",
        packSpace: 60,
    },
    shopping_cart: {
        description: "A SuperRalphs cart with one wheel locked at an angle.",
        name: "Shopping Cart",
        packSpace: 50,
    },
    suitcase: {
        description: "Bulgy and patched, with fraying seams.",
        name: "Suitcase",
        packSpace: 30,
    },
    wheelbarrow: {
        description:
            "Rusty, squeaky, and wobbly. Low enough to mess up your back.",
        name: "Wheelbarrow",
        packSpace: 40,
    },
};

export const WeaponDetails: Record<
    WeaponName,
    { name: string; damage: number }
> = {
    box_cutter: { name: "Box Cutter", damage: 4 },
    brass_knuckles: { name: "Brass Knuckles", damage: 5 },
    hedge_clippers: { name: "Hedge Clippers", damage: 6 },
    hockey_stick: { name: "Hockey Stick", damage: 8 },
    machete: { name: "Machete", damage: 7 },
};
