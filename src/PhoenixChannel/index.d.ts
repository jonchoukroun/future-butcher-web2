// export type CutType = "brains" | "flank" | "heart" | "liver" | "ribs";

export interface ApiState {
    player: {
        debt: number;
        funds: number;
        pack: Record<string, number>;
        pack_space: number;
        player_name: string;
        weapon: string | null;
    };
    rules: {
        state: "initialized" | "in_game" | "mugging" | "game_over";
        turns_left: number;
    };
    station: {
        market: Record<string, { price: number; quantity: number }>;
        station_name: string;
        store: null;
    };
}
