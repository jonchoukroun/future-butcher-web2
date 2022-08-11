/** @jsx jsx */
import { Global, css, jsx } from "@emotion/react";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { AlertServiceProvider } from "../AlertService/AlertServiceProvider";
import { Window } from "../Components/Window/Window";
import { WindowSizeProvider } from "../Components/Window/WindowSizeProvider";
import { ChannelProvider } from "../PhoenixChannel/ChannelProvider";
import { GameStateProvider } from "../GameData/GameStateProvider";
import * as Colors from "../Styles/colors";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [new BrowserTracing()],
});

export const App = () => {
    return (
        <ChannelProvider>
            <WindowSizeProvider>
                <AlertServiceProvider>
                    <GameStateProvider>
                        <Global styles={GlobalStyles} />
                        <Window />
                    </GameStateProvider>
                </AlertServiceProvider>
            </WindowSizeProvider>
        </ChannelProvider>
    );
};

const GlobalStyles = css`
    @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Splash&display=swap");
    html {
        block-size: 100%;
        inline-size: 100%;
    }

    body {
        min-block-size: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;
        background: ${Colors.Background.base};
    }

    button,
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
