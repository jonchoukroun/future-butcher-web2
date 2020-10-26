import * as React from "react";

import "./terminal.scss";

interface TerminalProps {
    textArray: string[];
    enterButtonBinding?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
    textArray,
}: TerminalProps) => {
    const windowWidth = window.innerWidth;
    let terminalWidth: number;
    if (windowWidth >= 1200) terminalWidth = Math.floor(windowWidth * 0.33);
    else if (windowWidth >= 768) terminalWidth = Math.floor(windowWidth * 0.45);
    else terminalWidth = Math.floor(windowWidth * 0.9);
    const terminalPosition = {
        width: `${terminalWidth}px`,
    };

    const textElements = textArray.map((text, idx) => (
        <h2 key={idx}>{text}</h2>
    ));

    return (
        <div className="transaction-terminal" style={terminalPosition}>
            {textElements}

            <div className="button-container">
                <button className="enter-button">Enter</button>
            </div>
        </div>
    );
};
