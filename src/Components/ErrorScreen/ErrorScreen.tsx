/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button, ButtonSize } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Animations from "../../Styles/animations";

export const ErrorScreen = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const { dispatch } = useGameState();

    const handleClick = () => {
        const playerName = localStorage.getItem("playerName");
        const playerHash = localStorage.getItem("playerHash");

        dispatch({
            type: "changeScreen",
            screen: !playerName || !playerHash ? Screen.Login : Screen.Welcome,
        });
    };

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    marginBlockStart: "50px",
                    paddingInline: "10px",
                }}
            >
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        marginBlockEnd: "20px",
                    }}
                >
                    <h4 css={{ marginInlineEnd: "10px", opacity: 0 }}>{">"}</h4>
                    <h1
                        css={{
                            marginInlineStart: "6px",
                        }}
                    >
                        Lockdown in LA!
                    </h1>
                </div>

                <div
                    css={{
                        display: "flex",
                    }}
                >
                    <h4 css={{ marginInlineEnd: "10px" }}>{">"}</h4>
                    <h4 css={{ marginInlineStart: "6px" }}>
                        A killer Belgian virus is burning across the globe. The
                        meat economy is at a standstill while people shelter in
                        place.
                    </h4>
                </div>

                <div
                    css={{
                        inlineSize: "100%",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h4
                        css={{
                            marginInlineEnd: "10px",
                            animation: `${Animations.blink} 1s linear infinite`,
                        }}
                    >
                        {">"}
                    </h4>

                    <Button
                        size={ButtonSize.Compact}
                        label={"Try Again"}
                        clickCB={handleClick}
                    />
                </div>
            </div>
        </div>
    );
};
