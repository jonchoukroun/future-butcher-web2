/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Screen } from "../Window/Window";
import * as Colors from "../../Styles/colors";

interface DesignMenuProps {
    onScreenItemClick: (screen: Screen) => void;
}

export const DesignMenu = ({ onScreenItemClick }: DesignMenuProps) => {
    return (
        <div
            css={{
                position: "absolute",
                top: "30px",
                right: 0,
                zIndex: 1000,
                backgroundColor: Colors.Background.body,
                borderWidth: "2px",
                borderStyle: "outset",
                borderBlockStartColor: Colors.Border.light,
                borderInlineStartColor: Colors.Border.light,
                borderBlockEndColor: Colors.Border.dark,
                borderInlineEndColor: Colors.Border.dark,
                boxShadow: "2px 2px 12px 2px rgba(0, 0, 0, 0.3)",
            }}
        >
            <ul
                css={{
                    inlineSize: "100%",
                    padding: 0,
                    margin: 0,
                    listStyleType: "none",
                }}
            >
                {Object.entries(Screen).map(([k, v]) => (
                    <li
                        key={k}
                        css={{
                            borderWidth: "2px",
                            borderStyle: "groove",
                            borderColor: "transparent",
                            borderBlockEndColor: Colors.Border.dark,
                            "&:last-of-type": {
                                borderColor: "transparent",
                            },
                        }}
                    >
                        <button
                            css={{
                                blockSize: "100%",
                                inlineSize: "100%",
                                paddingBlock: "8px",
                                paddingInline: "24px",
                                backgroundColor: "transparent",
                                border: "none",
                            }}
                            onClick={() => onScreenItemClick(v)}
                        >
                            {k}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
