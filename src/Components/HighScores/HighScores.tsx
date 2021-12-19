/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { formatMoney } from "../Utils/formatMoney";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const HighScores = () => {
    const {
        state: { highScores, player },
        dispatch,
    } = useGameState();

    const playerName = player?.playerName || localStorage.getItem("playerName");

    const { handleInitGame } = useChannel();
    const handleStartOverClick = () => {
        handleInitGame();
        dispatch({ type: "changeScreen", screen: Screen.Welcome });
    };

    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const scrollUp = keyframes`
        from { transform: translateY(20vh); }
        to   { transform: translateY(-1270vh); }
    `;

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
                    animation: `${scrollUp} 450s linear`,
                    zIndex: 0,
                }}
            >
                {highScores?.map(({ player, score }, idx) => (
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
                                        playerName === player
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
            >
                <ButtonPrimary
                    type={"Block"}
                    label={"Start Over"}
                    clickCB={handleStartOverClick}
                />
            </div>
        </div>
    );
};
