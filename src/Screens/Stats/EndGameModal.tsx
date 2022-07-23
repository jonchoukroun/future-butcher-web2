/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { handleMessage } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const EndGameModal = ({
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
            handleMessage("Cannot end game without a hash ID", "error");
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        const highScores = await handleEndGame(hashId, 0);
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
                    <p css={{ marginBlockEnd: "40px" }}>
                        Are you sure you want to quit?
                    </p>
                </div>

                <div css={{ display: "flex", justifyContent: "space-between" }}>
                    <ButtonPrimary
                        type={"Half"}
                        label={"Cancel"}
                        border={"None"}
                        clickCB={onCloseModal}
                    />

                    <ButtonPrimary
                        type={"Full"}
                        label={"Quit"}
                        isDanger={true}
                        clickCB={handleEndGameClick}
                    />
                </div>
            </div>
        </div>
    );
};
