/** @jsx jsx */
import { jsx } from "@emotion/react";

import { DesignMenu } from "./DesignMenu";
import { Screen } from "../Window/Window";
import * as Colors from "../../Styles/colors";

interface TopBarProps {
    title: string;
    isDesignMenuOpen: boolean;
    onDesignMenuButtonClick: () => void;
    handleScreenChange: (screen: Screen) => void;
}

export const TopBar = ({
    title,
    isDesignMenuOpen,
    onDesignMenuButtonClick,
    handleScreenChange,
}: TopBarProps) => {
    return (
        <div
            css={{
                position: "relative",
                inlineSize: "100%",
                display: "flex",
                backgroundColor: Colors.Background.accent,
                borderWidth: "2px",
                borderStyle: "inset",
                borderRadius: "2px",
                borderBlockStartColor: Colors.Border.dark,
                borderInlineStartColor: Colors.Border.dark,
                borderBlockEndColor: Colors.Border.light,
                borderInlineEndColor: Colors.Border.light,
            }}
        >
            <h2
                css={{
                    marginBlock: 0,
                    marginInlineStart: "5px",
                    color: Colors.Text.headingLight,
                }}
            >
                {title}
            </h2>
            <div
                css={{
                    display: "flex",
                    marginInlineStart: "auto",
                }}
            >
                <button
                    css={{
                        marginBlockStart: "2px",
                        marginBlockEnd: "3px",
                        marginInlineEnd: "3px",
                        paddingBlock: 0,
                        paddingInline: "5px",
                        backgroundColor: Colors.Background.body,
                        borderWidth: "2px",
                        borderStyle: "outset",
                        borderRadius: "2px",
                        borderBlockStartColor: Colors.Border.light,
                        borderInlineStartColor: Colors.Border.light,
                        borderBlockEndColor: Colors.Border.dark,
                        borderInlineEndColor: Colors.Border.dark,
                    }}
                    onClick={onDesignMenuButtonClick}
                >
                    Designs
                </button>
            </div>
            {isDesignMenuOpen && (
                <DesignMenu onScreenItemClick={handleScreenChange} />
            )}
        </div>
    );
};
