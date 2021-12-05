/** @jsx jsx */
import { jsx } from "@emotion/react";

import { formatMoney } from "../Utils/formatMoney";
import { CutType } from "../../Fixtures/marketCuts";
import { ButtonPrimary } from "../Form";
import * as Colors from "../../Styles/colors";

interface CutListItemProps {
    cut: CutType;
}

export const CutListItem = ({ cut }: CutListItemProps) => {
    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <div
                css={{
                    marginBlockEnd: "5px",
                    borderColor: "transparent",
                    borderBlockEndColor: Colors.Border.subtle,
                    borderStyle: "solid",
                    borderWidth: "1px",
                }}
            >
                <h3
                    css={{
                        margin: 0,
                        marginBlockEnd: "5px",
                        textTransform: "capitalize",
                        color: Colors.Text.primary,
                    }}
                >
                    {cut.name}
                </h3>
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    "& > button": {
                        marginInlineStart: "8px",
                    },
                }}
            >
                <p
                    css={{
                        margin: 0,
                        marginInlineEnd: "10px",
                        fontFamily: "Share Tech Mono",
                    }}
                >
                    {formatMoney(cut.price)}
                </p>
                <ButtonPrimary
                    label={"Buy"}
                    type={"Half"}
                    clickCB={() => {
                        return;
                    }}
                />
                <ButtonPrimary
                    label={"Sell"}
                    type={"Half"}
                    isDisabled={true}
                    clickCB={() => {
                        return;
                    }}
                />
            </div>
        </li>
    );
};
