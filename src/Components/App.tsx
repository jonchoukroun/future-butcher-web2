/** @jsx jsx */
import { Global, css, jsx } from "@emotion/react";

import { Window } from "./Window/Window";
import { WindowSizeProvider } from "./Window/WindowSizeProvider";
import { ChannelProvider } from "../PhoenixChannel/ChannelProvider";
import { GameStateProvider } from "../GameData/GameStateProvider";
import * as Colors from "../Styles/colors";

export const App = () => {
    return (
        <WindowSizeProvider>
            <ChannelProvider>
                <GameStateProvider>
                    <Global styles={GlobalStyles} />
                    <Window />
                </GameStateProvider>
            </ChannelProvider>
        </WindowSizeProvider>
    );
};

const GlobalStyles = css`
    html {
        block-size: 100%;
        inline-size: 100%;
    }

    body {
        min-block-size: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;
        background: black;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: Courier New, Courier, monospace;
        color: ${Colors.Text.base};
        word-spacing: 2px;
    }

    p {
        font-family: Courier New, Courier, monospace;
        color: ${Colors.Text.base};
    }

    small {
        font-family: Courier New, Courier, monospace;
        color: ${Colors.Text.subtle};
    }

    * {
        box-sizing: border-box;
        &:focus-visible {
            outline: solid ${Colors.Border.subtle};
        }
    }
`;
