import * as React from "react";

import { CashDetails } from "./cashDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCog } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

import "./statsBar.scss";

function formatMoney(amount: number) {
    if (amount >= 1_000_000) return `${Math.floor(amount / 1_000_000)} M`;
    if (amount >= 10_000) return `${Math.floor(amount / 1000)} K`;

    return amount;
}

export const StatsBar: React.FC = () => {
    const cash = 1_234_567_890;
    const debt = 50_000;
    const turns = 48;

    const [cashDetailIsVisible, setCashDetailIsVisible] = React.useState(false);
    const toggleCashDetail = (e: React.MouseEvent) => {
        e.preventDefault();
        setCashDetailIsVisible((cashDetailIsVisible) => !cashDetailIsVisible);
    };
    return (
        <>
            <div className="stats-bar">
                <div className="cash-stat">
                    ${formatMoney(cash)}
                    <button
                        className="stat-expander"
                        onClick={toggleCashDetail}
                    >
                        <FontAwesomeIcon icon={faAngleDown} />
                    </button>
                </div>
                <div className="debt-stat">
                    ${formatMoney(debt)}
                    <button className="stat-expander">
                        <FontAwesomeIcon icon={faAngleDown} />
                    </button>
                </div>
                <div className="turns-stat">
                    {turns}
                    <button className="stat-expander">
                        <FontAwesomeIcon icon={faAngleDown} />
                    </button>
                </div>
                <div className="settings-button">
                    <button className="stat-expander">
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                </div>
            </div>

            <CSSTransition
                in={cashDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <CashDetails cash={cash} />
            </CSSTransition>
            <div className="debt-details">Debt details</div>
            <div className="turns-details">Turns details</div>
            <div className="settings">Settings</div>
        </>
    );
};
