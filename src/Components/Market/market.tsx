import * as React from "react";

import { StatsBar } from "../StatsBar/statsBar";
import { CSSTransition } from "react-transition-group";
import { formatMoney } from "../Utils/formatMoney";

import { MARKET_CUTS } from "../../Fixtures/marketCuts";

import "./market.scss";

interface MarketProps {
    subwaySelector: () => void;
}

export const Market: React.FC<MarketProps> = ({
    subwaySelector,
}: MarketProps) => {
    const menu = MARKET_CUTS.map((cut, i) => {
        const delay = 1000 - i * Math.floor(1000 / MARKET_CUTS.length);
        return (
            <CSSTransition
                key={cut.name}
                in
                appear
                timeout={1000 + delay}
                classNames="cut-entry"
            >
                <div
                    key={i}
                    className="cut-entry"
                    style={{ transitionDelay: `${delay}ms` }}
                >
                    <h3 className="cut-name">
                        {cut.name} <span className="cut-info">(i)</span>
                    </h3>
                    <h4 className="cut-price">{formatMoney(cut.price)}</h4>
                    <h4 className="cut-quantity">({cut.quantity} lbs)</h4>
                </div>
            </CSSTransition>
        );
    });

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
