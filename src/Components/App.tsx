/** @jsx jsx */
import { Global, css, jsx } from "@emotion/react";

import { GameStateProvider } from "./GameState/GameStateProvider";
import { Window } from "./Window/Window";
import { WindowSizeProvider } from "./Window/WindowSizeProvider";
import * as Colors from "../Styles/colors";

export const App = () => {
    return (
        <WindowSizeProvider>
            <Global styles={GlobalStyles} />
            <GameStateProvider>
                <Window />
            </GameStateProvider>
        </WindowSizeProvider>
    );
};

const GlobalStyles = css`
    @import url("https://fonts.googleapis.com/css2?family=Michroma&family=Mr+Dafoe&family=Saira+Stencil+One&family=Share+Tech+Mono&display=swap");

    body {
        margin: 0;
        background: black;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        font-family: Michroma;
        color: ${Colors.Text.primary};
        word-spacing: 2px;
    }

    * {
        box-sizing: border-box;
        &:focus-visible {
            outline: solid ${Colors.Border.accent};
        }
    }
`;
