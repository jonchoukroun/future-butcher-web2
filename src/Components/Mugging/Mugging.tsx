/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { useChannel, Callback } from "../../PhoenixChannel/ChannelProvider";
import * as Colors from "../../Styles/colors";

export const Mugging = () => {
    const {
        dispatch,
        state: { player },
    } = useGameState();

    if (player === undefined) throw new Error("State is undefined");

    const { handlePushCallback } = useChannel();
    const [isLoading, setIsLoading] = useState(false);
    const handleFightMuggerClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback(Callback.fightMugger, {});
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData: response });
            dispatch({ type: "changeScreen", screen: Screen.Main });
            setIsLoading(false);
        });
    };

    console.log("!!player", player);

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2
                css={{
                    marginBlock: "20px",
                    color: Colors.Text.danger,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordSpacing: "4px",
                    textAlign: "center",
                }}
            >
                You&apos;re under attack!
            </h2>
            <div
                css={{
                    paddingInline: "8px",
                }}
            >
                <p>
                    One of the city&apos;s relentless muggers follows you from
                    the subway.
                </p>
                <p>
                    Pulling a well-used blade, he charges you. You have a split
                    second to react.{" "}
                </p>

                <div
                    css={{
                        display: "flex",
                        justifyContent: "center",
                        marginBlockStart: "20px",
                    }}
                >
                    <ButtonPrimary
                        type={"Full"}
                        label={"Fight"}
                        isDanger={true}
                        isLoading={isLoading}
                        clickCB={handleFightMuggerClick}
                    />
                </div>

                {!player.weapon && (
                    <p>A weapon would have come in handy here.</p>
                )}
            </div>
        </div>
    );
};
