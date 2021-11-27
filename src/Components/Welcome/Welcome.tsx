/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { KeyboardEvent, Fragment, useState } from "react";

import { usePlayer } from "../Player/PlayerContext";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Welcome = () => {
    const windowSize = useWindowSize();
    const headingWidth = Math.round(windowSize.inline * 0.2);

    const [playerName, setPlayerName] = useState("");
    function handleKeypress(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }
    const { name, saveName } = usePlayer();
    function handleSubmit() {
        if (playerName.length < 3) return;
        saveName(playerName);
    }

    return (
        <div
            css={css({
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            })}
            className="content-container"
        >
            {name ? (
                <h1>Welcome, {name}</h1>
            ) : (
                <Fragment>
                    <div
                        css={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBlockStart: "20px",
                            backgroundColor: "black",
                            borderWidth: "2px",
                            borderStyle: "inset",
                            borderBlockStartColor: Colors.Border.dark,
                            borderInlineStartColor: Colors.Border.dark,
                            borderBlockEndColor: Colors.Border.light,
                            borderInlineEndColor: Colors.Border.light,
                        }}
                    >
                        <h1
                            css={css({
                                fontFamily: "Arial black",
                                fontSize: `${headingWidth}px`,
                                color: "#0bd3d3",
                                margin: 0,
                                marginInlineStart: "-4px",
                            })}
                        >
                            FUTURE
                        </h1>
                        <h1
                            css={css({
                                fontFamily: "Mr Dafoe",
                                fontSize: `${headingWidth + 10}px`,
                                color: "#f890e7",
                                margin: 0,
                                marginBlockStart: `-${Math.round(
                                    headingWidth * 0.9,
                                )}px`,
                                marginInlineStart: "-4px",
                                transform: "rotate(-10deg)",
                            })}
                        >
                            Butcher
                        </h1>
                    </div>
                    <div
                        css={css({
                            inlineSize: "80%",
                            maxInlineSize: "350px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginBlockStart: "50px",
                        })}
                    >
                        <h4 css={css({ margin: 0 })}>
                            Enter your name to play
                        </h4>
                        <input
                            type="text"
                            placeholder="(3 to 20 characters long)"
                            required
                            minLength={3}
                            maxLength={20}
                            css={css({
                                blockSize: "25px",
                                inlineSize: "calc(100% - 8px)",
                                marginBlockStart: "10px",
                                bordeWidth: "2px",
                                borderStyle: "inset",
                                borderBlockStartColor: Colors.Border.dark,
                                borderInlineStartColor: Colors.Border.dark,
                                borderBlockEndColor: Colors.Border.light,
                                borderInlineEndColor: Colors.Border.light,
                                borderRadius: "2px",
                            })}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyPress={handleKeypress}
                        />
                        <button
                            css={css({
                                blockSize: "32px",
                                inlineSize: "100px",
                                alignSelf: "end",
                                marginBlock: "5px",
                                marginInline: 0,
                                backgroundColor: Colors.Background.body,
                                borderWidth: "2px",
                                borderStyle: "outset",
                                borderBlockStartColor: Colors.Border.light,
                                borderInlineStartColor: Colors.Border.light,
                                borderBlockEndColor: Colors.Border.dark,
                                borderInlineEndColor: Colors.Border.dark,
                                borderRadius: "2px",
                            })}
                            onClick={handleSubmit}
                        >
                            Start
                        </button>
                    </div>
                </Fragment>
            )}
        </div>
    );
};
