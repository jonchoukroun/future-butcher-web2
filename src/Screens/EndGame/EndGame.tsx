/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { Button, ButtonScheme, ButtonSize } from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { handleMessage } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

export const EndGame = () => {
    const {
        dispatch,
        state: { player, spaceAvailable },
    } = useGameState();
    if (player === undefined || spaceAvailable === undefined)
        throw new Error("State is undefined");

    const { heightAdjustment, layout } = useWindowSize();
    const { handleEndGame } = useChannel();

    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleRetireClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            handleMessage("Cannot end game without a hash ID", "error");
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        const score = player.funds;
        const highScores = await handleEndGame(hashId, score);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        if (score > 0) {
            localStorage.setItem("playerScore", score.toString());
        }
        unstable_batchedUpdates(() => {
            dispatch({ type: "setHighScores", highScores });
            dispatch({ type: "changeScreen", screen: Screen.HighScores });
        });

        if (isMountedRef.current) {
            setIsLoading(false);
        }
    };

    const canPayDebt = player.debt && player.funds >= player.debt;
    const hasCuts = spaceAvailable < player.packSpace;

    return (
        <div
            css={{
                blockSize: `calc(100% - ${heightAdjustment}px)`,
                maxBlockSize: "600px",
                display: "flex",
                flexDirection: "column",
                paddingInline: "8px",
            }}
        >
            <div
                css={{
                    marginBlockStart: "5px",
                    marginBlockEnd: layout === "full" ? "20px" : "5px",
                }}
            >
                <div css={{ display: "flex", marginBlock: "40px" }}>
                    <h4 css={{ marginInlineEnd: "10px", opacity: 0 }}>{">"}</h4>
                    <h1
                        css={{
                            marginBlock: 0,
                            marginInlineStart: "6px",
                            color: Colors.Text.base,
                        }}
                    >
                        Ready to Retire?
                    </h1>
                </div>

                <div css={{ marginBlockEnd: "20px" }}>
                    {canPayDebt && (
                        <div
                            css={{
                                display: "flex",
                                marginBlockEnd: "10px",
                            }}
                        >
                            <h4
                                css={{
                                    marginInlineEnd: "10px",
                                }}
                            >
                                {">"}
                            </h4>
                            <h4
                                css={{
                                    marginInlineStart: "6px",
                                    color: Colors.Text.base,
                                }}
                            >
                                You still owe money. Pay it off in the Info
                                screen.
                            </h4>
                        </div>
                    )}

                    {hasCuts && (
                        <div
                            css={{
                                display: "flex",
                            }}
                        >
                            <h4
                                css={{
                                    marginInlineEnd: "10px",
                                }}
                            >
                                {">"}
                            </h4>
                            <h4
                                css={{
                                    marginInlineStart: "6px",
                                    color: Colors.Text.base,
                                }}
                            >
                                You&apos;re still carrying product. Sell it at
                                the market.
                            </h4>
                        </div>
                    )}
                </div>

                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h4
                        css={{
                            marginInlineEnd: "16px",
                            animation:
                                !canPayDebt && !hasCuts
                                    ? `${Animations.blink} 1s linear infinite`
                                    : "",
                        }}
                    >
                        {">"}
                    </h4>
                    <Button
                        size={ButtonSize.Compact}
                        scheme={
                            !canPayDebt && !hasCuts
                                ? ButtonScheme.Normal
                                : ButtonScheme.Inverse
                        }
                        label={"Retire"}
                        clickCB={handleRetireClick}
                    />
                </div>
            </div>
        </div>
    );
};