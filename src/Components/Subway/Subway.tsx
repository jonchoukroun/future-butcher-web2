/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Stations } from "./Stations";
import { ButtonPrimary } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";

export const Subway = () => {
    const { isCompact } = useWindowSize();

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: "10px",
            }}
        >
            <div
                css={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    alignSelf: "stretch",
                    marginBlockStart: "20px",
                }}
            >
                <Stations />
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    justifyContent: isCompact ? "space-between" : "end",
                    paddingBlock: "10px",
                }}
            >
                <ButtonPrimary
                    label={"Back"}
                    type={"Full"}
                    clickCB={() => {
                        return;
                    }}
                />
                <ButtonPrimary
                    label={"Details"}
                    type={"Full"}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>
        </div>
    );
};
