import * as React from "react";

interface CashDetailsProps {
    cash: number;
    bankBalance?: number;
}

function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
}

export const CashDetails: React.FC<CashDetailsProps> = ({
    cash,
    bankBalance = 100,
}: CashDetailsProps) => {
    return (
        <div className="stat-detail">
            <p>Cash on hand: {formatMoney(cash)}</p>
            <p>
                {bankBalance > 0
                    ? `Bank balance: ${formatMoney(bankBalance)}`
                    : "You have no money in the bank."}
            </p>
        </div>
    );
};
