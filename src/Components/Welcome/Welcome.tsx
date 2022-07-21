/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useWindowSize } from "../Window/WindowSizeProvider";
import { Button, ButtonSize } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { player } from "../../Fixtures/player";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Animations from "../../Styles/animations";

export const Welcome = () => {
    const { getContentSize, layout } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const date = new Date();
    date.setFullYear(2055, date.getMonth(), date.getDate());
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const displayDate = date.toLocaleDateString("en-US", options);

    const { handlePushCallback } = useChannel();
    const { dispatch } = useGameState();
    const [isLoading, setIsLoading] = useState(false);
    const handleStartClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback(Callback.startGame, {});
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        if (response.rules.state !== "in_game") {
            dispatch({ type: "changeScreen", screen: Screen.Login });
            return;
        }

        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData: response });
            dispatch({ type: "changeScreen", screen: Screen.Market });
            setIsLoading(false);
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
                    display: "flex",
                    flexDirection: "column",
                    marginBlock: "20px",
                    paddingInline: "10px",
                }}
            >
                <h2
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        fontSize: "48px",
                        textTransform: "uppercase",
                    }}
                >
                    Los Angeles
                </h2>
                <h4 css={{ marginBlock: 0 }}>{displayDate}</h4>
            </div>

            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockStart: layout === "full" ? "40px" : 0,
                    paddingInline: "10px",
                    p: {
                        marginBlockEnd: layout === "full" ? "16px" : 0,
                    },
                }}
            >
                <p>
                    The economy is in ruins after the collapse of HypeCoin. The
                    rich and famous are nuts for the latest fad -{" "}
                    <em>fresh, human meat</em>.
                </p>

                <p>
                    Two-bit hustlers like you have only one option: get rich off
                    this new addiction before becoming the product.
                </p>

                <p>
                    Use the Subway to nagivate the city&apos;s neighborhoods.
                    Buy and sell from the Meat Markets, but watch your back!
                    Gangs run the city, and you don&apos;t want to cross them.
                </p>

                <p>
                    You have 24 hours and a {formatMoney(player.debt)} loan.
                    Hurry up, it&apos;s got a 5% hourly interest rate. Welcome
                    to the People&apos;s Republic of Los Angeles.
                </p>
            </div>

            <div
                css={{
                    position: layout === "compact" ? "absolute" : "relative",
                    bottom: 0,
                    blockSize: "70px",
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBlockStart: layout === "full" ? "40px" : 0,
                    padding: "10px",
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
                    label={"Start Game"}
                    size={ButtonSize.Full}
                    isLoading={isLoading}
                    clickCB={handleStartClick}
                />
            </div>
        </div>
    );
};
