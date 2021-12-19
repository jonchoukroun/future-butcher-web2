/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { useChannel, Callback } from "../../PhoenixChannel/ChannelProvider";
import * as Colors from "../../Styles/colors";
import { unstable_batchedUpdates } from "react-dom";

export const Mugging = () => {
    const { dispatch } = useGameState();

    const { handlePushCallback } = useChannel();
    const handleFightMuggerClick = async () => {
        const response = await handlePushCallback(Callback.fightMugger, {});
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        unstable_batchedUpdates(() => {
            dispatch({ type: "updateStateData", stateData: response });
            dispatch({ type: "changeScreen", screen: Screen.Main });
        });
    };

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
                        clickCB={handleFightMuggerClick}
                    />
                </div>
            </div>
        </div>
    );
};
