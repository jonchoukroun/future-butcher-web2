export const enum Cut {
    brains = "brains",
    flank = "flank",
    heart = "heart",
    liver = "liver",
    ribs = "ribs",
}

export interface ApiState {
    player: {
        debt: number;
        funds: number;
        pack: Record<Cut, number>;
        pack_space: number;
        player_name: string;
        weapon: string | null;
    };
    rules: {
        state: "initialized" | "in_game" | "mugging" | "game_over";
        turns_left: number;
    };
    station: {
        market: Record<Cut, { price: number; quantity: number }>;
        station_name: string;
        store: null;
    };
}
