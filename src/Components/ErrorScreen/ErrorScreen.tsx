/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";

export const ErrorScreen = () => {
    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const { dispatch } = useGameState();

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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlock: "20px",
                    paddingInline: "10px",
                }}
            >
                <h2
                    css={{
                        marginBlockEnd: "20px",
                        fontVariantCaps: "small-caps",
                        textAlign: "center",
                    }}
                >
                    Los Angeles is under lockdown.
                </h2>
                <p>
                    A new Norwegian virus is burning across the globe. The
                    economy is at a standstill while people shelter in place.
                </p>

                <ButtonPrimary
                    type={"Full"}
                    label={"Try Again"}
                    clickCB={() =>
                        dispatch({
                            type: "changeScreen",
                            screen: Screen.Welcome,
                        })
                    }
                />
            </div>
        </div>
    );
};
