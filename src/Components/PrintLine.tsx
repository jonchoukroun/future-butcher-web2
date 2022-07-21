/** @jsx jsx */
import { jsx } from "@emotion/react";

import * as Colors from "../Styles/colors";

interface PrintLineProps {
    text: string;
}

export function PrintLine({ text }: PrintLineProps) {
    return (
        <div
            css={{
                display: "flex",
                alignItems: "flex-start",
                marginBlockEnd: "8px",
                "& h4": { color: Colors.Text.base, marginBlock: 0 },
            }}
        >
            <h4 css={{ marginInlineEnd: "18px" }}>{">"}</h4>
            <h4>{text}</h4>
        </div>
    );
}
