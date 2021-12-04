/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";

export const NavBar = () => {
    return (
        <div
            css={{
                blockSize: "70px",
                inlineSize: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ButtonPrimary
                type={"Stretch"}
                label={"Back"}
                clickCB={() => {
                    return;
                }}
            />
        </div>
    );
};
