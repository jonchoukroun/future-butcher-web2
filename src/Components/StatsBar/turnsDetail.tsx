import * as React from "react";

interface TurnsDetailProps {
    turns: number;
    debt: number;
}

export const TurnsDetail: React.FC<TurnsDetailProps> = ({
    turns,
    debt,
}: TurnsDetailProps) => {
    return (
        <div className="stat-detail">
            <p>You have {turns} hours left.</p>
            {debt > 0 && <p>Remember, your debt grows by 5% per hour.</p>}
        </div>
    );
};
