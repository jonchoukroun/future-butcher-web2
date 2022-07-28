/** @jsx jsx */
import { jsx } from "@emotion/react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./Screens/App";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
    <StrictMode>
        <App />
    </StrictMode>,
);
