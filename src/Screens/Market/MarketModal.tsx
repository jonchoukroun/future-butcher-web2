/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import {
    Button,
    ButtonPrompt,
    ButtonPromptSize,
    ButtonScheme,
    ButtonSize,
    PrintLine,
    TextInput,
} from "../../Components";
import { LineSize, PromptScheme } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { CutType, Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";
import { getSpaceAvailable } from "../../Utils/spaceAvailable";

import * as Colors from "../../Styles/colors";

export type TransactionType = "buy" | "sell";
interface MarketModalProps {
    transaction: TransactionType;
    cut: CutType;
    onModalClose: () => void;
    onTransactionSuccess: (cut: CutType) => void;
}

export const MarketModal = ({
    transaction,
    cut,
    onModalClose,
    onTransactionSuccess,
}: MarketModalProps) => {
    const {
        dispatch,
        state: { market, player },
    } = useGameState();
    if (market === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();
    const { getContentSize, layout, windowSize } = useWindowSize();
    const { inlineSize } = getContentSize();

    const { pack, totalPackSpace } = player;

    const spaceAvailable = getSpaceAvailable({ pack, totalPackSpace });

    const listing = market.find((item) => item.name === cut);
    if (listing === undefined) throw new Error("Invalid listing");

    const { price, quantity } = listing;
    const stock = transaction === "buy" ? quantity : pack[cut];

    const maxAfford = Math.floor(player.funds / price);
    const maxTransact =
        transaction === "sell"
            ? pack[cut]
            : Math.min(quantity, maxAfford, spaceAvailable);

    const [inputValue, setInputValue] = useState<number | undefined>(
        maxTransact,
    );
    const [isAmountValid, setIsAmountValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (errorMessage) setErrorMessage(undefined);

        const value = parseInt(event.target.value);
        setInputValue(value);
    };

    useEffect(() => {
        if (!inputValue) {
            setIsAmountValid(false);
            return;
        }

        if (transaction === "buy") {
            if (inputValue > maxAfford) {
                setErrorMessage(
                    `Too expensive. You can only afford ${maxAfford} ${pluralize(
                        maxAfford,
                    )} of ${cut}. Try the Max button.`,
                );
                setIsAmountValid(false);
                return;
            }
            if (inputValue > spaceAvailable) {
                setErrorMessage(
                    `Not enough room. You can only carry ${spaceAvailable} more ${pluralize(
                        spaceAvailable,
                    )}.`,
                );
                setIsAmountValid(false);
                return;
            }
            if (inputValue > stock) {
                setErrorMessage(
                    `Not enough ${cut} in stock. Only ${stock} ${pluralize(
                        stock,
                    )} available.`,
                );
                setIsAmountValid(false);
                return;
            }
        } else {
            if (inputValue > pack[cut]) {
                setErrorMessage(
                    `You only have ${stock} ${pluralize(
                        stock,
                    )}. Try the Max button.`,
                );
                setIsAmountValid(false);
                return;
            }
        }

        setIsAmountValid(true);
    }, [cut, inputValue, maxAfford, pack, spaceAvailable, stock, transaction]);

    const handleSubmit = async () => {
        if (isLoading) return;
        if (!isAmountValid) return;

        setIsLoading(true);

        if (transaction === "buy") {
            const response = await handlePushCallback("buyCut", {
                cut,
                amount: inputValue,
            });
            // TODO: API error handling
            if (response === undefined || isApiError(response)) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            setInputValue(undefined);
            setIsLoading(false);
            onTransactionSuccess(cut);

            dispatch({ type: "updateStateData", stateData: response });
            onModalClose();
        } else {
            const response = await handlePushCallback("sellCut", {
                cut,
                amount: inputValue,
            });
            // TODO: API error handling
            if (response === undefined || isApiError(response)) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            setInputValue(undefined);
            setIsLoading(false);
            onTransactionSuccess(cut);

            dispatch({ type: "updateStateData", stateData: response });
            onModalClose();
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "Enter":
                handleSubmit();
                return;
            case "Escape":
                setInputValue(undefined);
                return;
            default:
                return;
        }
    };

    const inlineSizeOffset = layout === "full" ? 24 : 15;

    const title = `${transaction} ${cut}`;

    const buttonLabel =
        inputValue === maxTransact
            ? `${transaction} max (${inputValue} ${pluralize(inputValue)})`
            : isAmountValid && inputValue
            ? `${transaction} ${inputValue} ${pluralize(inputValue)} ${cut}`
            : transaction;

    const baseModalStyle = css({
        inlineSize: `${inlineSize - inlineSizeOffset}px`,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: Colors.Background.base,
        borderColor: Colors.Border.subtle,
        borderRadius: "1px",
        borderStyle: "outset",
        borderWidth: "3px",
        boxShadow: "2px 2px 12px 4px rgba(0, 0, 0, 0.4)",
        zIndex: 1001,
    });
    const fullLayoutModal = css(baseModalStyle, {
        position: "relative",
    });
    const compactLayoutModal = css(baseModalStyle, {
        position: "absolute",
        insetBlockStart: layout === "full" ? "70px" : "30px",
        insetInlineEnd: layout === "full" ? "23px" : "15px",
    });

    return (
        <div
            css={{
                position: "fixed",
                insetBlockStart: 0,
                insetBlockEnd: 0,
                insetInlineStart: 0,
                insetInlineEnd: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 1000,
            }}
        >
            <div
                css={{
                    inlineSize: windowSize.inlineSize,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div
                    css={
                        layout === "full" ? fullLayoutModal : compactLayoutModal
                    }
                >
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <PrintLine
                            text={title}
                            size={LineSize.Title}
                            promptScheme={PromptScheme.Hidden}
                            marginBlockEnd={"20px"}
                        />
                        <Button
                            label={"X"}
                            scheme={ButtonScheme.Inverse}
                            size={ButtonSize.Small}
                            clickCB={onModalClose}
                        />
                    </div>

                    {errorMessage && (
                        <PrintLine
                            text={errorMessage}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Hidden}
                            danger
                            marginBlockEnd={"12px"}
                        />
                    )}

                    <PrintLine
                        text={`Price: ${formatMoney(price)}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <PrintLine
                        text={`${
                            transaction === "buy" ? "In Stock:" : "In Pack:"
                        } ${stock > 0 ? stock : "Out of stock"}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <PrintLine
                        text={`Enter an amount to ${transaction}`}
                        promptScheme={PromptScheme.Past}
                        size={LineSize.Body}
                    />

                    <TextInput
                        placeholder={"How many?"}
                        type={"number"}
                        value={`${inputValue || ""}`}
                        blink={!isAmountValid}
                        showPrompt={true}
                        changeCB={handleInputChange}
                        keyDownCB={handleKeyPress}
                    />

                    <div css={{ marginBlockStart: "10px" }}>
                        <ButtonPrompt
                            label={buttonLabel}
                            size={ButtonPromptSize.Full}
                            blink={isAmountValid}
                            disabled={!isAmountValid}
                            clickCB={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function pluralize(quantity: number): "lb" | "lbs" {
    if (quantity === 1) return "lb";
    return "lbs";
}
