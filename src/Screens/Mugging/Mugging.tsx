/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { MuggingDefeat } from "./MuggingDefeat";
import { MuggingVictory } from "./MuggingVictory";
import { ButtonPrompt, ButtonPromptSize } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

export const Mugging = () => {
    const {
        dispatch,
        state: { muggers, player, turnsLeft },
    } = useGameState();

    if (player === undefined || turnsLeft === undefined) {
        console.log("!!Mugging", muggers, player, turnsLeft);
        throw new Error("State is undefined");
    }

    if (muggers === undefined) {
        handleMessage("Muggers is undefined", MessageLevel.Error);
    }

    const { pack } = player;
    const initialTurnsLeft = useRef(turnsLeft);
    const initialPack = useRef(pack);

    const [muggingState, setMuggingState] = useState<
        "victory" | "defeat" | undefined
    >(undefined);

    const currentMuggerRef = useRef(
        muggers === undefined ? "Fred Savage" : muggers[0],
    );

    const { handlePushCallback } = useChannel();
    const [isLoading, setIsLoading] = useState(false);
    const handleFightMuggerClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback("fightMugger", {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "updateStateData", stateData: response });
        unstable_batchedUpdates(() => {
            const outcome =
                initialTurnsLeft.current > response.rules.turns_left
                    ? "defeat"
                    : "victory";

            // If the mugger is defeated, remove him from the list
            if (outcome === "victory") {
                dispatch({ type: "killMugger" });
            }
            setMuggingState(outcome);
            setIsLoading(false);
        });
    };

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                paddingInline: "10px",
            }}
        >
            <div css={{ display: "flex", marginBlock: "20px" }}>
                <h4 css={{ marginInlineEnd: "10px", opacity: 0 }}>{">"}</h4>
                <h2
                    css={{
                        marginBlock: "20px",
                        marginInlineStart: "6px",
                        color: Colors.Text.danger,
                    }}
                >
                    {muggingState === undefined
                        ? "You're under attack!"
                        : muggingState === "defeat"
                        ? "You lost!"
                        : "You win!"}
                </h2>
            </div>

            {muggingState === "victory" ? (
                <MuggingVictory initialPack={initialPack.current} />
            ) : muggingState === "defeat" ? (
                <MuggingDefeat initialTurnsLeft={initialTurnsLeft.current} />
            ) : (
                <div css={{ paddingInline: "10px" }}>
                    <div
                        css={{
                            display: "flex",
                        }}
                    >
                        <h4 css={{ marginInlineEnd: "10px" }}>{">"}</h4>
                        <h4 css={{ marginInlineStart: "6px" }}>
                            One of the city&apos;s relentless muggers,{" "}
                            {currentMuggerRef.current}, follows you from the
                            subway.
                        </h4>
                    </div>

                    <div
                        css={{
                            display: "flex",
                        }}
                    >
                        <h4 css={{ marginInlineEnd: "10px" }}>{">"}</h4>
                        <h4 css={{ marginInlineStart: "6px" }}>
                            Pulling a well-used blade, he charges you. You have
                            a split second to react.
                        </h4>
                    </div>

                    {!player.weapon && (
                        <div
                            css={{
                                display: "flex",
                            }}
                        >
                            <h4 css={{ marginInlineEnd: "10px" }}>{">"}</h4>
                            <h4 css={{ marginInlineStart: "6px" }}>
                                A weapon would have come in handy here.
                            </h4>
                        </div>
                    )}

                    <div
                        css={{
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
                        <ButtonPrompt
                            size={ButtonPromptSize.Compact}
                            label={"Fight the Mugger"}
                            clickCB={handleFightMuggerClick}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
