/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { formatMoney } from "../Utils/formatMoney";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { useChannel } from "../../GameData/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const HighScores = () => {
    const {
        state: { highScores },
        dispatch,
    } = useGameState();

    const { getContentSize } = useWindowSize();
    const { inlineSize } = getContentSize();

    const { handleInitGame } = useChannel();
    const handleStartOverClick = () => {
        handleInitGame();
        dispatch({ type: "changeScreen", screen: Screen.Welcome });
    };

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
            <h2
                css={{
                    marginBlockStart: "5px",
                    marginBlockEnd: "20px",
                    color: Colors.Text.heading,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordSpacing: "4px",
                    textAlign: "center",
                }}
            >
                Game Over
            </h2>

            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    marginBlock: "15px",
                }}
            >
                {highScores?.map(({ player, score }, idx) => (
                    <div
                        key={`${idx}-${player}`}
                        css={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <small>{player}</small>
                        <small>{formatMoney(score)}</small>
                    </div>
                ))}
            </div>

            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <ButtonPrimary
                    type={"Stretch"}
                    label={"Start Over"}
                    clickCB={handleStartOverClick}
                />
            </div>
        </div>
    );
};
