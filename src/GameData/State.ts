import {
    OwnedCutsType,
    PlayerType,
    MarketListing,
    MarketType,
    StoreListing,
    StoreType,
    WeaponType,
} from ".";
import { WelcomeScreen } from "../Screens/Welcome/Welcome";

/**
 * This is the shaped of state as defined by the API.
 *
 * TODO: runtime type validation (io-ts)
 */
export type ApiStateType = {
    player: {
        cash: number;
        debt: number;
        has_oil: boolean;
        health: number;
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
        clinic_price: number | null;
        oil_price: number | null;
    };
};

export type ApiErrorType = { error: string };

// FIXME: develop enum for stable dev-time lookups
export type GameProcessType =
    | "initialized"
    | "in_game"
    | "mugging"
    | "game_over";

export type StationType =
    | "bell_gardens"
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
    clinicPrice?: number;
    oilPrice?: number;
    turnsLeft?: number;
    hasUnseenAlerts?: boolean;
    screenProps?: WelcomeScreen;
};

export const enum Screen {
    Login = "login",
    Welcome = "welcome",
    Subway = "subway",
    Market = "market",
    Stats = "stats",
    Store = "store",
    Clinic = "clinic",
    GameResult = "gameResult",
    Mugging = "mugging",
    LastTurn = "lastTurn",
    Death = "death",
    Error = "error",
    Credits = "credits",
    HighScores = "highScores",
}
export type ScreenType = `${Screen}`;

export type HighScoresType = { player: string; score: number }[];

export function isApiError(
    response: ApiStateType | ApiErrorType | undefined,
): response is ApiErrorType {
    return (response as ApiErrorType).error !== undefined;
}
