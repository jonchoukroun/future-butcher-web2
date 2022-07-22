/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Prompt } from "./Prompt";
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
            <Prompt />
            <h4>{text}</h4>
        </div>
    );
}
