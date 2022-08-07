/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

import * as Colors from "../../Styles/colors";
import { Button, ButtonScheme } from "../../Components";

export const QuitGameModal = ({
    onCloseModal,
}: {
    onCloseModal: () => void;
}) => {
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    });

    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useGameState();
    const { handleEndGame } = useChannel();
    const handleEndGameClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        const hashId = localStorage.getItem("playerHash");
        if (!hashId) {
            handleMessage(
                "Cannot end game without a hash ID",
                MessageLevel.Error,
            );
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        const highScores = await handleEndGame(hashId, 0);
        if (highScores === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        dispatch({ type: "setHighScores", highScores });
        dispatch({ type: "changeScreen", screen: Screen.GameResult });
        if (isMountedRef.current) {
            setIsLoading(false);
        }
    };

    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();
    const inlineSizeOffset = layout === "full" ? 24 : 15;

    return (
        <div
            css={{
                position: "fixed",
                insetBlockStart: 0,
                insetBlockEnd: 0,
                insetInlineStart: 0,
                insetInlineEnd: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1000,
            }}
        >
            <div
                css={{
                    position: "absolute",
                    insetBlockStart: layout === "full" ? "70px" : "30px",
                    insetInlineEnd: layout === "full" ? "23px" : "15px",
                    inlineSize: `${inlineSize - inlineSizeOffset}px`,
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px",
                    backgroundColor: Colors.Background.base,
                    borderColor: Colors.Border.subtle,
                    borderRadius: "4px",
                    borderStyle: "outset",
                    borderWidth: "2px",
                    boxShadow: "2px 2px 12px 4px rgba(0, 0, 0, 0.4)",
                    zIndex: 1001,
                }}
            >
                <div
                    css={{
                        display: "flex",
                        justifyContent: "center",
                        paddingInline: "20px",
                    }}
                >
                    <h3>Are you sure you want to quit?</h3>
                </div>

                <div css={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                        label={"Yes, Quit!"}
                        scheme={ButtonScheme.Danger}
                        clickCB={handleEndGameClick}
                    />
                    <Button label={"Cancel"} clickCB={onCloseModal} />
                </div>
            </div>
        </div>
    );
};