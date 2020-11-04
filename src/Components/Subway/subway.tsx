import * as React from "react";

import { StatsBar } from "../StatsBar/statsBar";
import { CSSTransition } from "react-transition-group";
import { SUBWAY_STATIONS } from "../../Fixtures/subwayStations";

import "./subway.scss";

interface SubwayProps {
    marketSelector: () => void;
}

export const Subway: React.FC<SubwayProps> = ({
    marketSelector,
}: SubwayProps) => {
    const handleMarketClick = (e: React.MouseEvent) => {
        e.preventDefault();
        marketSelector();
    };
    const destinations = SUBWAY_STATIONS.map((station, i) => {
        const delay = 1000 - i * 200;
        return (
            <CSSTransition
                key={station.name}
                in
                appear
                timeout={1000 + delay}
                classNames="subway-station"
            >
                <li
                    key={station.name}
                    className="subway-station"
                    style={{ transitionDelay: `${delay}ms` }}
                >
                    <p className="station-name">{station.name}</p>
                    <button className="station-select">
                        {station.travelTime} hours
                    </button>
                </li>
            </CSSTransition>
        );
    });
    return (
        <div className="game-screen">
            <StatsBar />
            <h3 className="screen-header">Select a destination</h3>
            <ul className="station-list">{destinations}</ul>
            <div className="navigation-buttons">
                <button onClick={handleMarketClick}>Market</button>
            </div>
        </div>
    );
};
