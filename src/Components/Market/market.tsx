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
            <h3 className="cut-name">
                {cut.name} <span className="cut-info">(i)</span>
            </h3>
            <h4 className="cut-price">${cut.price}</h4>
            <h4 className="cut-quantity">({cut.quantity} lbs)</h4>
        </div>
    ));

    const handleSubwayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        subwaySelector();
    };

    const [isAtTop, setIsAtTop] = React.useState(true);
    const [hasLowerContent, setHasLowerContent] = React.useState(false);
    React.useEffect(() => {
        const menuContainer: Element = document.getElementsByClassName(
            "cuts-menu",
        )[0];
        if (menuContainer.scrollHeight > menuContainer.clientHeight)
            setHasLowerContent(true);
    }, []);
    const handleScroll = (e: React.UIEvent) => {
        const element = e.target as HTMLDivElement;
        element.scrollTop > 0 ? setIsAtTop(false) : setIsAtTop(true);
        element.scrollTop + element.clientHeight === element.scrollHeight
            ? setHasLowerContent(false)
            : setHasLowerContent(true);
    };

    return (
        <div className="game-screen">
            <StatsBar />
            <h3 className="screen-header">Select a cut to buy or sell</h3>
            <div
                className={
                    isAtTop ? "top-indicator" : "top-indicator is-visible"
                }
            >
                . . .
            </div>
            <div className="cuts-menu" onScroll={handleScroll}>
                {menu}
            </div>
            <div
                className={
                    hasLowerContent
                        ? "bottom-indicator is-visible"
                        : "bottom-indicator"
                }
            >
                . . .
            </div>
            <div className="navigation-buttons">
                <button onClick={handleSubwayClick}>Subway</button>
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
];
