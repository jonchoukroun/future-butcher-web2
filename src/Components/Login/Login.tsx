/** @jsx jsx */
import { jsx } from "@emotion/react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { ButtonPrimary, TextInput } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useChannel } from "../../GameData/ChannelProvider";
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
    const headingWidth = Math.round(windowSize.inlineSize * 0.2);

    const [playerName, setPlayerName] = useState("");
    function handleKeypress(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }
    const { handleJoinChannel } = useChannel();
    const { dispatch } = useGameState();
    const [isLoading, setIsLoading] = useState(false);
    async function handleSubmit() {
        if (isLoading) return;
        if (playerName.length < 3) return;
        setIsLoading(true);
        await handleJoinChannel(playerName);
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
                <h4 css={{ margin: 0 }}>Enter your name</h4>
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
                        type={"Full"}
                        label={isLoading ? "Joining" : "Start"}
                        clickCB={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};
