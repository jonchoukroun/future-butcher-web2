/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const SurplusStore = () => {
    const { heightAdjustment, layout } = useWindowSize();

    return (
        <div
            css={{
                blockSize: `calc(100% - ${heightAdjustment}px)`,
                maxBlockSize: "600px",
                display: "flex",
                flexDirection: "column",
                paddingInline: "8px",
            }}
        >
            {layout === "full" && (
                <h2
                    css={{
                        marginBlock: 0,
                        color: Colors.Text.base,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        wordSpacing: "4px",
                    }}
                >
                    Gus&apos; Army Surplus
                </h2>
            )}

            <p css={{ marginBlock: "40px" }}>
                Welcome to the last bastion of freedom in LA! We have the best
                gear to ensure your liberty.
            </p>

            <p>You look like you could use more carrying space.</p>
            <div
                css={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlockEnd: "40px",
                }}
            >
                <ButtonPrimary
                    type={"Block"}
                    label={"Buy Packs"}
                    scheme={"Inverse"}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>

            <p>
                Ain&apos;t no more 2nd ammendment, but we still have all your
                personal defense needs.
            </p>
            <div
                css={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlockEnd: "40px",
                }}
            >
                <ButtonPrimary
                    type={"Block"}
                    label={"Buy Weapons"}
                    scheme={"Inverse"}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>
        </div>
    );
};
