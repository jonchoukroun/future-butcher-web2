/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutList } from "./CutList";
import { NavBar } from "../Window/NavBar";
import { StatsBar } from "../Window/StatsBar";

export const Market = () => {
    return (
        <div
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
            }}
        >
            <StatsBar />
            <CutList />
            <NavBar />
        </div>
    );
};
