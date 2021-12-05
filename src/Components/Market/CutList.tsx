/** @jsx jsx */
import { jsx } from "@emotion/react";

import { CutListItem } from "./CutListItem";
import { cuts } from "../../Fixtures/marketCuts";

export const CutList = () => {
    return (
        <ul
            css={{
                blockSize: "100%",
                display: "flex",
                flexDirection: "column",
                margin: 0,
                padding: 0,
                listStyleType: "none",
            }}
        >
            {cuts.map((cut, idx) => (
                <CutListItem key={`${cut.name}-${idx}`} cut={cut} />
            ))}
        </ul>
    );
};
