/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Stations } from "./Stations";
import { FullButton } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

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
                    backgroundColor: Colors.Background.body,
                    borderWidth: "2px",
                    borderStyle: "inset",
                    borderBlockStartColor: Colors.Border.dark,
                    borderInlineStartColor: Colors.Border.dark,
                    borderBlockEndColor: Colors.Border.light,
                    borderInlineEndColor: Colors.Border.light,
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
                <FullButton
                    label={"Cancel"}
                    clickCB={() => {
                        return;
                    }}
                />
                <FullButton
                    label={"Details"}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>
        </div>
    );
};
