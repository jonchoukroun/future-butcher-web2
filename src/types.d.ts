type CutName = "brains" | "flank" | "heart" | "liver" | "ribs";

type Market = { [key in CutName]: { price: number; quantity: number } };

type Pack = { [key in CutName]: number };

type PackName = "mini_fridge" | "shopping_cart" | "suitcase" | "wheelbarrow";
// type PackListings = {
//     [key in PackName]: { pack_space: number; price: number };
// };

type PackListing = [string, { pack_space: number; price: number }][];

// type WeaponName =
//     | "box_cutter"
//     | "brass_knuckes"
//     | "hedge_clippers"
//     | "hockey_stick"
//     | "knife"
//     | "machete";
// type WeaponListings = {
//     [key in WeaponName]: { cuts: CutName[]; damage: number; price: number };
// };

// type Store = {
//     [key in WeaponName | PackName]: key extends PackName
//         ? { pack_space: number; price: number }
//         : {
//               cuts: string[];
//               damage: number;
//               price: number;
//           };
// };

type Store = Record<
    string,
    | { pack_space: number; price: number }
    | { cuts: string[]; damage: number; price: number }
>;

interface ApiState {
    player: {
        debt: number;
        funds: number;
        pack: Pack;
        pack_space: number;
        player_name: string;
        weapon: string | null;
    };
    rules: {
        state: "initialized" | "in_game" | "mugging" | "game_over";
        turns_left: number;
    };
    station: {
        market: Market | null;
        station_name: string;
        store: Store | null;
    };
}
