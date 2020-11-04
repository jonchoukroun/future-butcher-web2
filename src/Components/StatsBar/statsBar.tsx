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
                <button
                    className="cash-stat"
                    data-testid="cash-stat"
                    onClick={toggleCashDetail}
                >
                    ${formatMoney(cash)}
                    {cashDetailIsVisible ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                    )}
                </button>
                <button
                    className="debt-stat"
                    data-testid="debt-stat"
                    onClick={toggleDebtDetail}
                >
                    -${formatMoney(debt)}
                    {debtDetailIsVisible ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                    )}
                </button>
                <button
                    className="turns-stat"
                    data-testid="turns-stat"
                    onClick={toggleTurnsDetail}
                >
                    {turns}
                    {turnsDetailIsVisible ? (
                        <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown} />
                    )}
                </button>
                <button className="settings-button">
                    <FontAwesomeIcon icon={faCog} title="settings-icon" />
                </button>
            </div>

            <CSSTransition
                in={cashDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <CashDetail cash={cash} data-testid="cash-detail" />
            </CSSTransition>
            <CSSTransition
                in={debtDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <DebtDetail debt={debt} cash={cash} data-testid="debt-detail" />
            </CSSTransition>
            <CSSTransition
                in={turnsDetailIsVisible}
                timeout={500}
                unmountOnExit
                classNames="stat-detail"
            >
                <TurnsDetail
                    turns={turns}
                    debt={debt}
                    data-testid="turns-detail"
                />
            </CSSTransition>
            <div className="settings">Settings</div>
        </>
    );
};
