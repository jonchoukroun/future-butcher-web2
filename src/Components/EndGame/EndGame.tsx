/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { ButtonPrimary } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Colors from "../../Styles/colors";
import { unstable_batchedUpdates } from "react-dom";

export const EndGame = () => {
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const {
        dispatch,
        state: { player, spaceAvailable },
    } = useGameState();
    if (player === undefined || spaceAvailable === undefined)
        throw new Error("State is undefined");

    const { handleEndGame } = useChannel();
    const [isLoading, setIsLoading] = useState(false);
    const handleRetireClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            throw new Error("Cannot end game without a hash ID");
        }
        const score = player.funds;
        const highScores = await handleEndGame(hashId, score);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        unstable_batchedUpdates(() => {
            dispatch({ type: "setHighScores", highScores });
            dispatch({ type: "changeScreen", screen: Screen.HighScores });
        });

        if (isMountedRef.current) {
            setIsLoading(false);
        }
    };

    const { heightAdjustment, layout } = useWindowSize();

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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockStart: "5px",
                    marginBlockEnd: layout === "full" ? "20px" : "5px",
                    textAlign: "center",
                }}
            >
                <div css={{ marginBlock: "40px" }}>
                    <h3
                        css={{
                            marginBlock: 0,
                            color: Colors.Text.base,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            wordSpacing: "4px",
                        }}
                    >
                        Ready to Quit?
                    </h3>
                </div>

                <div css={{ marginBlockEnd: "20px" }}>
                    {player.debt > 0 && player.funds > player.debt && (
                        <Fragment>
                            <p>You still owe money.</p>
                            <p>Pay it off in the Info screen</p>
                        </Fragment>
                    )}

                    {spaceAvailable < player.packSpace && (
                        <p>
                            You&apos;re still carrying product. Sell it at the
                            market.
                        </p>
                    )}
                </div>

                <ButtonPrimary
                    type={"Full"}
                    label={"Retire"}
                    scheme={"Inverse"}
                    clickCB={handleRetireClick}
                />
            </div>
        </div>
    );
};
