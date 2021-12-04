/** @jsx jsx */
import { jsx } from "@emotion/react";
import { KeyboardEvent, useState } from "react";

import { ButtonPrimary, TextInput } from "../Form";
import { useGameState } from "../GameState/GameStateProvider";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Welcome = () => {
    const { getContentSize, windowSize } = useWindowSize();
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

    const { blockSize, inlineSize } = getContentSize();

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: `${inlineSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockStart: "20px",
                    backgroundColor: "black",
                    borderColor: Colors.Border.subtle,
                    borderRadius: "7px",
                    borderStyle: "inset",
                    borderWidth: "2px",
                }}
            >
                <h1
                    css={{
                        fontFamily: "Saira Stencil One",
                        fontSize: `${headingWidth}px`,
                        color: Colors.Text.accent,
                        margin: 0,
                        marginInlineStart: "-4px",
                    }}
                >
                    FUTURE
                </h1>
                <h1
                    css={{
                        fontFamily: "Mr Dafoe",
                        fontSize: `${headingWidth + 10}px`,
                        color: Colors.Text.danger,
                        margin: 0,
                        marginBlockStart: `-${Math.round(
                            headingWidth * 0.9,
                        )}px`,
                        marginInlineStart: "-4px",
                        transform: "rotate(-10deg)",
                    }}
                >
                    Butcher
                </h1>
            </div>
            <div
                css={{
                    inlineSize: "80%",
                    maxInlineSize: "322px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginBlockStart: "50px",
                }}
            >
                <h4 css={{ margin: 0 }}>Enter your name to play</h4>
                <TextInput
                    placeholder="(3 to 20 characters long)"
                    lengthOptions={[3, 20]}
                    changeCB={(e) => setPlayerName(e.target.value)}
                    keypressCB={handleKeypress}
                />
                <div
                    css={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBlockStart: "8px",
                    }}
                >
                    <ButtonPrimary
                        type="Full"
                        label="Start"
                        clickCB={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};
