import * as React from "react";

import { StatsBar } from "../StatsBar/statsBar";
import { CSSTransition } from "react-transition-group";

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
    const destinations = SUBWAY_FIXTURE.map((station, i) => {
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

const SUBWAY_FIXTURE = [
    {
        name: "beverly hills",
        travelTime: 3,
        description: "Home of the rich & famous. Safest neighborhood.",
        baseCrimeRate: 1,
    },
    {
        name: "downtown",
        travelTime: 2,
        description: "Tight security.",
        baseCrimeRate: 2,
    },
    {
        name: "venice beach",
        travelTime: 2,
        description: "Relatively safe, but the palm trees are dead.",
        baseCrimeRate: 3,
    },
    {
        name: "hollywood",
        travelTime: 1,
        description: "Rough, grimy, seedy.",
        baseCrimeRate: 4,
    },
    {
        name: "compton",
        travelTime: 1,
        description: "Anarchy - free subway rides and certain death.",
        baseCrimeRate: 5,
    },
    {
        name: "bell gardens",
        travelTime: 2,
        description: "Find Gus's Army Surplus Store here.",
        baseCrimeRate: 0,
    },
];
