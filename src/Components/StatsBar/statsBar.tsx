import * as React from "react";

import { CashDetail } from "./cashDetail";
import { DebtDetail } from "./debtDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faCog,
} from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

import "./statsBar.scss";
import { TurnsDetail } from "./turnsDetail";

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
        setDebtDetailIsVisible(false);
        setTurnsDetailIsVisible(false);
        setCashDetailIsVisible((cashDetailIsVisible) => !cashDetailIsVisible);
    };

    const [debtDetailIsVisible, setDebtDetailIsVisible] = React.useState(false);
    const toggleDebtDetail = (e: React.MouseEvent) => {
        e.preventDefault();
        setCashDetailIsVisible(false);
        setTurnsDetailIsVisible(false);
        setDebtDetailIsVisible((debtDetailIsVisible) => !debtDetailIsVisible);
    };

    const [turnsDetailIsVisible, setTurnsDetailIsVisible] = React.useState(
        false,
    );
    const toggleTurnsDetail = (e: React.MouseEvent) => {
        e.preventDefault();
        setCashDetailIsVisible(false);
        setDebtDetailIsVisible(false);
        setTurnsDetailIsVisible(
            (turnsDetailIsVisible) => !turnsDetailIsVisible,
        );
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
                        {cashDetailIsVisible ? (
                            <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} />
                        )}
                    </button>
                </div>
                <div className="debt-stat">
                    ${formatMoney(debt)}
                    <button
                        className="stat-expander"
                        onClick={toggleDebtDetail}
                    >
                        {debtDetailIsVisible ? (
                            <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} />
                        )}
                    </button>
                </div>
                <div className="turns-stat">
                    {turns}
                    <button
                        className="stat-expander"
                        onClick={toggleTurnsDetail}
                    >
                        {turnsDetailIsVisible ? (
                            <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                            <FontAwesomeIcon icon={faAngleDown} />
                        )}
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
                <CashDetail cash={cash} />
            </CSSTransition>
            <CSSTransition
                in={debtDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <DebtDetail debt={debt} cash={cash} />
            </CSSTransition>
            <CSSTransition
                in={turnsDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <TurnsDetail turns={turns} debt={debt} />
            </CSSTransition>
            <div className="settings">Settings</div>
        </>
    );
};
