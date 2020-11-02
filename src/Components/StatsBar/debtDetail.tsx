import * as React from "react";

interface DebtDetailsProps {
    debt: number;
    cash: number;
}

function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
}

export const DebtDetail: React.FC<DebtDetailsProps> = ({
    debt,
    cash,
}: DebtDetailsProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const debtAccruing = (
        <>
            <p>Current debt: {formatMoney(debt)}</p>
            {cash > debt ? (
                <a href="#" onClick={handleClick}>
                    Pay it off with FlayPal
                </a>
            ) : (
                <p>Your debt is growing by 5% each hour. You should hustle.</p>
            )}
        </>
    );
    const debtPaid = <p>Your debt is paid off.</p>;
    return (
        <div className="stat-detail">{debt > 0 ? debtAccruing : debtPaid}</div>
    );
};
