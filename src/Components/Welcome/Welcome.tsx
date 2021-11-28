/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { KeyboardEvent, useState } from "react";

import { FullButton, TextInput } from "../Form";
import { useGameState } from "../GameState/GameStateProvider";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

interface WelcomeProps {
    contentSize: {
        blockSize: number;
        inlineSize: number;
    };
}

export const Welcome = ({
    contentSize: { blockSize, inlineSize },
}: WelcomeProps) => {
    const { windowSize } = useWindowSize();
    const headingWidth = Math.round(windowSize.inlineSize * 0.2);

    const [playerName, setPlayerName] = useState("");
    function handleKeypress(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }
    const { savePlayerName } = useGameState();
    function handleSubmit() {
        if (playerName.length < 3) return;
        savePlayerName(playerName);
    }

    return (
        <div
            css={css({
                blockSize,
                inlineSize,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
        >
            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockStart: "20px",
                    backgroundColor: "black",
                    borderWidth: "2px",
                    borderStyle: "inset",
                    borderBlockStartColor: Colors.Border.dark,
                    borderInlineStartColor: Colors.Border.dark,
                    borderBlockEndColor: Colors.Border.light,
                    borderInlineEndColor: Colors.Border.light,
                }}
            >
                <h1
                    css={css({
                        fontFamily: "Arial black",
                        fontSize: `${headingWidth}px`,
                        color: "#0bd3d3",
                        margin: 0,
                        marginInlineStart: "-4px",
                    })}
                >
                    FUTURE
                </h1>
                <h1
                    css={css({
                        fontFamily: "Mr Dafoe",
                        fontSize: `${headingWidth + 10}px`,
                        color: "#f890e7",
                        margin: 0,
                        marginBlockStart: `-${Math.round(
                            headingWidth * 0.9,
                        )}px`,
                        marginInlineStart: "-4px",
                        transform: "rotate(-10deg)",
                    })}
                >
                    Butcher
                </h1>
            </div>
            <div
                css={css({
                    inlineSize: "80%",
                    maxInlineSize: "322px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginBlockStart: "50px",
                })}
            >
                <h4 css={css({ margin: 0 })}>Enter your name to play</h4>
                <TextInput
                    placeholder="(3 to 20 characters long)"
                    lengthOptions={[3, 20]}
                    changeCB={(e) => setPlayerName(e.target.value)}
                    keypressCB={handleKeypress}
                />
                <FullButton label="Start" clickCB={handleSubmit} />
            </div>
        </div>
    );
};
