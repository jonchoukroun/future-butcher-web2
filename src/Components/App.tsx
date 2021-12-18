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
    @import url("https://fonts.googleapis.com/css2?family=Michroma&family=Mr+Dafoe&family=Saira+Stencil+One&family=Share+Tech+Mono&display=swap");

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
        font-family: Michroma;
        color: ${Colors.Text.primary};
        word-spacing: 2px;
    }

    p {
        font-family: Share Tech Mono;
        color: ${Colors.Text.primary};
    }

    small {
        font-family: Share Tech Mono;
        color: ${Colors.Text.primary};
    }

    * {
        box-sizing: border-box;
        &:focus-visible {
            outline: solid ${Colors.Border.accent};
        }
    }
`;
