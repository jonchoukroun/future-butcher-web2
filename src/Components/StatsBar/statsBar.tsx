import * as React from "react";

import "./statsBar.scss";

export const StatsBar: React.FC = () => {
    return (
        <div className="stats-bar">
            <div className="cash-stat">$5,000 v</div>
            <div className="debt-stat">$5,000 v</div>
            <div className="turns-stat">48 v</div>
            <div className="settings">(|)</div>
        </div>
    );
};
