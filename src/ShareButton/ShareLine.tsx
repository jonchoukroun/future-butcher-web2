/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ShareButton } from "./ShareButton";

export function ShareLine({ shareText }: { shareText?: string }) {
    return (
        <div
            css={{
                inlineSize: "100%",
                marginBlockStart: "20px",
                textAlign: "center",
            }}
        >
            <h4>Tell your friends</h4>
            <div
                css={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                <ShareButton platform={"fb"} shareText={shareText} />
                <ShareButton platform={"twitter"} shareText={shareText} />
                <ShareButton platform={"reddit"} shareText={shareText} />
                <ShareButton platform={"email"} shareText={shareText} />
            </div>
        </div>
    );
}
