/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button } from "./Button";
// import { ButtonPrompt, ButtonPromptSize } from "./ButtonPrompt";
import { formatMoney } from "../Utils/formatMoney";

import * as Colors from "../Styles/colors";

interface ListItemTemplateProps {
    itemName: CutName | PackName | string;
    price: number;
    // Hide border under last item
    isLast: boolean;
    // Right button is required (Buy in Cuts Market)
    rightButtonLabel: string;
    isRightButtonDisabled: boolean;
    rightButtonCB: () => void;
    // Left button is optional (Sell in Cuts Market)
    leftButtonLabel?: string;
    isLeftButtonDisabled?: boolean;
    leftButtonCB?: () => void;
}

export function ListItemTemplate({
    itemName,
    price,
    isLast,
    rightButtonLabel,
    isRightButtonDisabled,
    rightButtonCB,
    leftButtonLabel,
    isLeftButtonDisabled,
    leftButtonCB,
}: ListItemTemplateProps) {
    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                borderColor: "transparent",
                borderBlockEndColor: isLast
                    ? "transparent"
                    : Colors.Border.subtle,
                borderStyle: "dashed",
                borderWidth: "2px",
            }}
        >
            <div
                css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBlockEnd: "5px",
                    paddingInline: "10px",
                }}
            >
                <div css={{ inlineSize: "100px" }}>
                    <h2
                        css={{
                            margin: 0,
                            color: Colors.Text.base,
                            textTransform: "capitalize",
                        }}
                    >
                        {itemName}
                    </h2>
                </div>

                <div
                    css={{
                        inlineSize: "120px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <h2
                        css={{
                            margin: 0,
                            color: Colors.Text.base,
                        }}
                    >
                        {formatMoney(price)}
                    </h2>
                </div>
            </div>
            <div
                css={{
                    inlineSize: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingInline: "10px",
                }}
            >
                {leftButtonLabel && leftButtonCB ? (
                    <div
                        css={{
                            inlineSize: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            label={leftButtonLabel}
                            disabled={isLeftButtonDisabled}
                            clickCB={leftButtonCB}
                        />

                        <Button
                            label={rightButtonLabel}
                            disabled={isRightButtonDisabled}
                            clickCB={rightButtonCB}
                        />
                    </div>
                ) : (
                    <div
                        css={{
                            inlineSize: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            label={rightButtonLabel}
                            disabled={isRightButtonDisabled}
                            clickCB={rightButtonCB}
                        />
                    </div>
                )}
            </div>
        </li>
    );
}
