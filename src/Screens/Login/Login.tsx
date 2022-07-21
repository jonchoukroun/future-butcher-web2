/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import {
    ButtonPrompt,
    ButtonPromptSize,
    PrintLine,
    TextInput,
} from "../../Components";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";

import * as Colors from "../../Styles/colors";

export const Login = () => {
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const { getContentSize, windowSize } = useWindowSize();
    const headingWidth = Math.round(windowSize.inlineSize * 0.12);

    const [playerName, setPlayerName] = useState<string>();
    const [nameIsValid, setNameIsValid] = useState(false);
    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (playerName) setNameIsValid(isNameValid(playerName));

        if (event.key === "Enter") {
            handleSubmit();
        }
    }
    const { handleJoinChannel } = useChannel();
    const { dispatch } = useGameState();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    async function handleSubmit() {
        if (isLoading || !playerName) return;
        if (!isNameValid(playerName)) return;

        setIsLoading(true);
        try {
            await handleJoinChannel(playerName);
        } catch {
            setIsLoading(false);
            if (errorMessage) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
            } else {
                setErrorMessage("Something went wrong. Try another name.");
            }
            return;
        }
        dispatch({ type: "changeScreen", screen: Screen.Welcome });
        if (isMountedRef.current) {
            setIsLoading(false);
        }
    }

    const { blockSize } = getContentSize();

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBlockStart: "75px",
            }}
        >
            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h1
                    css={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: `${headingWidth}px`,
                        color: Colors.Text.base,
                        marginBlock: "20px",
                    }}
                >
                    future
                </h1>
                <h1
                    css={{
                        fontFamily: "Splash",
                        fontSize: `${headingWidth + 10}px`,
                        color: Colors.Text.danger,
                        margin: 0,
                        marginBlockStart: `-${Math.round(
                            headingWidth * 0.7,
                        )}px`,
                        transform: "rotate(-10deg)",
                        textTransform: "uppercase",
                    }}
                >
                    butcher
                </h1>
            </div>
            <div
                css={{
                    inlineSize: "80%",
                    maxInlineSize: "322px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginBlockStart: "75px",
                }}
            >
                {errorMessage && (
                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "20px",
                            color: Colors.Text.danger,
                        }}
                    >
                        {errorMessage}
                    </p>
                )}

                <PrintLine text={"Enter your name:"} />

                <TextInput
                    placeholder="(3 to 20 characters long)"
                    lengthOptions={[3, 20]}
                    blink={!nameIsValid}
                    styleOptions={css({ marginBlock: "8px" })}
                    changeCB={(e) => setPlayerName(e.target.value)}
                    keyDownCB={handleKeyDown}
                />

                {nameIsValid && (
                    <ButtonPrompt
                        label={"Start the Game"}
                        size={ButtonPromptSize.Full}
                        blink={true}
                        loading={isLoading}
                        clickCB={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

function isNameValid(name: string) {
    return name.length >= 3 && name.length <= 20;
}
