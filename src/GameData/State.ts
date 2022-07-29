import {
    OwnedCutsType,
    PlayerType,
    MarketListing,
    MarketType,
    StoreListing,
    StoreType,
    WeaponType,
} from ".";

/**
 * This is the shaped of state as defined by the API.
 *
 * TODO: runtime type validation (io-ts)
 */
export type ApiStateType = {
    player: {
        debt: number;
        funds: number;
        pack: OwnedCutsType;
        pack_space: number;
        player_name: string;
        weapon: WeaponType | null;
    };
    rules: {
        state: GameProcessType;
        turns_left: number;
    };
    station: {
        market: MarketType | null;
        station_name: StationType;
        store: StoreType | null;
    };
};

// FIXME: develop enum for stable dev-time lookups
export type GameProcessType =
    | "initialized"
    | "in_game"
    | "mugging"
    | "game_over";

export type StationType =
    | "beverly_hills"
    | "compton"
    | "downtown"
    | "hollywood"
    | "venice_beach";

/**
 * This is the serialized data type used in this client.
 *
 * TODO: consider using a serializer to map a type to an enum
 */
export type GameStateType = {
    currentProcess?: GameProcessType;
    currentScreen?: ScreenType;
    currentStation?: StationType;
    highScores?: HighScoresType;
    market?: MarketListing[];
    // FIXME: consider a type for muggers
    muggers?: string[];
    player?: PlayerType;
    store?: StoreListing;
    turnsLeft?: number;
};

// FIXME: develop enum for stable dev-time lookups
export type ScreenType =
    | "login"
    | "welcome"
    | "subway"
    | "market"
    | "store"
    | "highScores"
    | "mugging"
    | "endGame"
    | "error";

export type HighScoresType = { player: string; score: number }[];
