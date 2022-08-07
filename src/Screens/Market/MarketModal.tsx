/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

import { useAlertService } from "../../AlertService/AlertServiceProvider";
import {
    Button,
    ButtonScheme,
    ButtonSize,
    PrintLine,
    Prompt,
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
}

export const MarketModal = ({
    transaction,
    cut,
    onModalClose,
}: MarketModalProps) => {
    const {
        dispatch,
        state: { market, player },
    } = useGameState();
    if (market === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();
    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();
    const { pushAlert } = useAlertService();

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

    const [inputValue, setInputValue] = useState<number>();
    const [isAmountValid, setIsAmountValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState<"custom" | "max">();

    const handleMaxClick = () => {
        setErrorMessage(undefined);
        setInputValue(undefined);

        handleSubmit(maxTransact, true);
    };

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

    const handleSubmit = async (amount: number, isMax: boolean) => {
        if (isLoading) return;
        if (!amount || (!isMax && !isAmountValid)) return;

        setIsLoading(isMax ? "max" : "custom");

        if (transaction === "buy") {
            const response = await handlePushCallback("buyCut", {
                cut,
                amount,
            });
            // TODO: API error handling
            if (response === undefined || isApiError(response)) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            setInputValue(undefined);
            setIsLoading(undefined);
            pushAlert({
                text: `Successfully bought ${amount} ${pluralize(
                    amount,
                )} of ${cut}.`,
                isPersistent: false,
            });
            dispatch({ type: "updateStateData", stateData: response });
            onModalClose();
        } else {
            const response = await handlePushCallback("sellCut", {
                cut,
                amount,
            });
            // TODO: API error handling
            if (response === undefined || isApiError(response)) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            setInputValue(undefined);
            setIsLoading(undefined);
            pushAlert({
                text: `Successfully sold ${amount} ${pluralize(
                    amount,
                )} of ${cut}.`,
                isPersistent: false,
            });
            dispatch({ type: "updateStateData", stateData: response });
            onModalClose();
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "Enter":
                handleSubmit(inputValue ?? 0, false);
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
        isAmountValid && inputValue
            ? `${transaction} ${inputValue} ${
                  inputValue > 1 ? "lbs" : "lb"
              } ${cut}`
            : transaction;

    const modalStyle = css({
        position: "absolute",
        insetBlockStart: layout === "full" ? "70px" : "30px",
        insetInlineEnd: layout === "full" ? "23px" : "15px",
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

    return (
        <div
            css={{
                position: "fixed",
                insetBlockStart: 0,
                insetBlockEnd: 0,
                insetInlineStart: 0,
                insetInlineEnd: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: 1000,
            }}
        >
            <div css={modalStyle}>
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
                    } ${stock}`}
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
                    showPrompt={!isAmountValid}
                    changeCB={handleInputChange}
                    keyDownCB={handleKeyPress}
                />

                <div
                    css={{
                        display: "flex",
                        marginBlock: "10px",
                        "& button": { flex: 1 },
                    }}
                >
                    <Prompt hidden={true} />
                    <Button
                        label={buttonLabel}
                        size={ButtonSize.Full}
                        scheme={
                            inputValue === undefined
                                ? ButtonScheme.Hidden
                                : ButtonScheme.Base
                        }
                        disabled={!isAmountValid || isLoading === "max"}
                        loading={isLoading === "custom"}
                        clickCB={() => handleSubmit(inputValue ?? 0, false)}
                    />
                </div>

                <PrintLine
                    text={`Or, ${transaction} the max`}
                    promptScheme={PromptScheme.Past}
                    size={LineSize.Body}
                />

                <div css={{ display: "flex", "& button": { flex: 1 } }}>
                    <Prompt hidden={true} />
                    <Button
                        label={`${transaction} max (${maxTransact} ${pluralize(
                            maxTransact,
                        )})`}
                        size={ButtonSize.Full}
                        disabled={isLoading === "custom"}
                        loading={isLoading === "max"}
                        clickCB={handleMaxClick}
                    />
                </div>
            </div>
        </div>
    );
};

function pluralize(quantity: number): "lb" | "lbs" {
    if (quantity === 1) return "lb";
    return "lbs";
}
