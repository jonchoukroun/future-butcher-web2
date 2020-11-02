import * as React from "react";

import { formatMoney } from "../Utils/formatMoney";

interface CashDetailProps {
    cash: number;
    bankBalance?: number;
}

export const CashDetail: React.FC<CashDetailProps> = ({
    cash,
    bankBalance = 100,
}: CashDetailProps) => {
    const moneyBalance = (
        <>
            <p>Bank balance: {formatMoney(bankBalance)}</p>
            <p className="total-item">
                Total: {formatMoney(cash + bankBalance)}
            </p>
        </>
    );
    return (
        <div className="stat-detail">
            <p>Cash on hand: {formatMoney(cash)}</p>
            {bankBalance > 0 ? (
                moneyBalance
            ) : (
                <p>You have no money in the bank.</p>
            )}
        </div>
    );
};
