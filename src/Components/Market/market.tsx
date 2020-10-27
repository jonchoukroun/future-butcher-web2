import * as React from "react";

import { StatsBar } from "../StatsBar/statsBar";

import "./market.scss";

interface MarketProps {
    subwaySelector: () => void;
}

export const Market: React.FC<MarketProps> = ({
    subwaySelector,
}: MarketProps) => {
    const menu = MARKET_FIXTURE.map((cut, i) => (
        <div key={i} className="cut-entry">
            <h4 className="cut-name">
                {cut.name} <span className="cut-info">(i)</span>
            </h4>
            <h4 className="cut-price">${cut.price}</h4>
            <h4 className="cut-quantity">({cut.quantity} lbs)</h4>
        </div>
    ));

    const handleSubwayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        subwaySelector();
    };

    return (
        <div id="market">
            <StatsBar />
            <h3 className="cuts-header">Select a cut to buy or sell</h3>
            <div className="cuts-menu">{menu}</div>
            <div className="button-container">
                <button className="subway-select" onClick={handleSubwayClick}>
                    Subway
                </button>
            </div>
        </div>
    );
};

const MARKET_FIXTURE = [
    {
        name: "heart",
        price: 18000,
        quantity: 12,
    },
    {
        name: "flank",
        price: 7312,
        quantity: 17,
    },
    {
        name: "brain",
        price: 78900,
        quantity: 3,
    },
    {
        name: "loin",
        price: 800,
        quantity: 34,
    },
    {
        name: "ribs",
        price: 1011,
        quantity: 24,
    },
    {
        name: "heart",
        price: 18000,
        quantity: 12,
    },
    {
        name: "flank",
        price: 7312,
        quantity: 17,
    },
    {
        name: "brain",
        price: 78900,
        quantity: 3,
    },
    {
        name: "loin",
        price: 800,
        quantity: 34,
    },
    {
        name: "ribs",
        price: 1011,
        quantity: 24,
    },
];
