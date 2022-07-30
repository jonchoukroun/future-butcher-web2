/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";

export const HighScores = () => {
    const {
        state: { highScores, player },
        dispatch,
    } = useGameState();

    if (highScores === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const playerName = player.playerName || localStorage.getItem("playerName");
    const playerScore = parseInt(localStorage.getItem("playerScore") || "0");

    const { handleInitGame } = useChannel();
    const handleStartOverClick = () => {
        handleInitGame();
        dispatch({ type: "changeScreen", screen: "welcome" });
    };

    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    blockSize: "70px",
                    inlineSize: `${inlineSize}px`,
                    backgroundColor: Colors.Background.base,
                    borderRadius: "4px",
                    zIndex: 100,
                }}
            >
                <h2
                    css={{
                        marginBlockStart: "5px",
                        marginBlockEnd: "20px",
                        color: Colors.Text.base,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        wordSpacing: "4px",
                        textAlign: "center",
                    }}
                >
                    Game Over
                </h2>
            </div>

            <div
                css={{
                    blockSize: `${blockSize}px`,
                    inlineSize: `${inlineSize}px`,
                    marginBlock: "15px",
                    paddingInline: "8px",
                    zIndex: 0,
                }}
            >
                {highScores &&
                    highScores.slice(0, 15).map(({ player, score }, idx) => (
                        <div
                            key={`${idx}-${player}`}
                            css={{
                                display: "flex",
                                justifyContent: "space-between",
                                paddingBlock: playerName === player ? "4px" : 0,
                                paddingInline: "8px",
                                backgroundColor:
                                    playerName === player
                                        ? Colors.Background.inverse
                                        : Colors.Background.base,
                                borderRadius: "2px",
                                "& p": {
                                    marginBlock: "4px",
                                    color:
                                        playerName === player
                                            ? Colors.Text.inverse
                                            : Colors.Text.base,
                                },
                            }}
                        >
                            <p>
                                <span
                                    css={{
                                        color:
                                            playerName === player &&
                                            playerScore === score
                                                ? Colors.Text.inverse
                                                : Colors.Text.subtle,
                                    }}
                                >
                                    {idx + 1}
                                </span>
                                . {player}
                            </p>
                            <p>{formatMoney(score)}</p>
                        </div>
                    ))}
            </div>

            <div
                css={{
                    blockSize: "70px",
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: Colors.Background.base,
                    borderRadius: "4px",
                    zIndex: 100,
                }}
            ></div>
        </div>
    );
};
