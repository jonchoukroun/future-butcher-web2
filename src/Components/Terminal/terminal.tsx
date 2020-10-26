import * as React from "react";

import "./terminal.scss";

interface TerminalProps {
    textArray: string[];
    enterButtonBinding?: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({
    textArray,
    enterButtonBinding,
}: TerminalProps) => {
    const prompt = "//>";
    const textElements = textArray.map((text, idx) => (
        <h2 key={idx}>
            <span className="terminal-prompt">{prompt}</span> {text}
        </h2>
    ));

    const handleEnterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (enterButtonBinding) enterButtonBinding();
    };

    return (
        <div className="terminal-container">
            <div className="transaction-terminal">
                {textElements}

                {enterButtonBinding && (
                    <div className="button-container">
                        <button
                            className="enter-button"
                            onClick={handleEnterClick}
                        >
                            Enter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
