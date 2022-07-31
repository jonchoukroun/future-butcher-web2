export type CutType = "brains" | "flank" | "heart" | "ribs" | "liver";

export type CutListingType = { price: number; quantity: number };
export type MarketType = { [Cut in CutType]: CutListingType };

export interface MarketListing extends CutListingType {
    name: CutType;
}
