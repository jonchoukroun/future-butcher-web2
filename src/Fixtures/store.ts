import { CutType, PackType, WeaponType } from "../GameData";

export const CutSurge: {
    [Cut in CutType]: { price: number; messages: string[] };
} = {
    brains: {
        price: 150000,
        messages: [
            "There's a zombie LARP event in town. Brains are in high demand.",
            "Dr. Jake convinces wealthy housewives that eating brains improves gut health. Prices skyrocket.",
            "Exams are coming up at Kanye West Middle School. Students are scrambling to eat some brains!",
        ],
    },
    heart: {
        price: 50000,
        messages: [
            "Cops busted a local plastic surgeon selling heart on the black market and people are hungry!",
            "A tech trillionaire ordered all the heart in town. Can you get these rich scumbags the heart they crave?",
            "A Temple of Doom remake has fans scurrying for heart.",
        ],
    },
    flank: {
        price: 20000,
        messages: [
            "The doomsday cult supplying the neighborhood with flank just drank the koolaid! Will you clean up here?",
            "A virus has made all flank in the neighborhood inedible. Celebrities are offering everything they have for a taste.",
            "The New Vegan Church crucified all flank providers in town - can you save the day?",
        ],
    },
    ribs: {
        price: 8000,
        messages: [
            "A new study shows eating ribs eliminates crows feet. Middle-aged actors are scrambling for ribs.",
            "Local gangs are at war and stopped supplying ribs. Can you handle the demand?",
            "The annual Boyle Heights BBQ Competition is heating up! They’ll buy all the ribs you have.",
        ],
    },
    liver: {
        price: 8000,
        messages: [
            "It's the Hannibal Lecter Club's annual convention. Liver and Chianti prices are outta control.",
            "Locally grown onion is tasting pretty good, so farmer's markets are stocking up on liver.",
            "An ancient recipe is trending hard, and the main ingredient is liver.",
        ],
    },
};

export type PackDetailsType = {
    description: string;
    displayName: string;
    packSpace: number;
};
export const PackDetails: { [Pack in PackType | "backpack"]: PackDetailsType } =
    {
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
            description:
                "A SuperRalphs cart with one wheel locked at an angle.",
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

export type WeaponDetailsType = {
    displayName: string;
    damage: number;
};
export const WeaponDetails: { [Weapon in WeaponType]: WeaponDetailsType } = {
    box_cutter: { displayName: "Box Cutter", damage: 4 },
    brass_knuckles: { displayName: "Brass Knuckles", damage: 5 },
    hedge_clippers: { displayName: "Hedge Clippers", damage: 6 },
    hockey_stick: { displayName: "Hockey Stick", damage: 8 },
    machete: { displayName: "Machete", damage: 7 },
};
