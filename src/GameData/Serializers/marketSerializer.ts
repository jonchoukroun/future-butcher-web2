import { MarketType, MarketListing, CutType } from "..";

export function serializeMarket(market: MarketType): MarketListing[] {
    return Object.entries(market).reduce(
        (serializedMarket, [cutName, cutDetails]) => {
            serializedMarket.push({
                ...cutDetails,
                name: cutName as CutType,
            });
            return serializedMarket;
        },
        [] as MarketListing[],
    );
}
