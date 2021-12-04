/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutListItem } from "./CutListItem";
// import { useWindowSize } from "../Window/WindowSizeProvider";
import { cuts } from "../../Fixtures/marketCuts";

export const CutList = () => {
    return (
        <ul
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                alignItems: "stretch",
                margin: 0,
                padding: 0,
                paddingBlockStart: "20px",
                listStyleType: "none",
            }}
        >
            {cuts.map((cut, idx) => (
                <CutListItem key={`${cut.name}-${idx}`} cut={cut} />
            ))}
        </ul>
    );
};
