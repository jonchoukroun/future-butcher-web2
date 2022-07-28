/** @jsx jsx */
import { jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { Button, TextInput, PrintLine } from "../../Components";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { formatMoney } from "../../Utils";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";
import { LineSize } from "../../Components/PrintLine";

export type TransactionMode = "buy" | "sell";

interface TransactionModalProps {
    mode: TransactionMode;
    cut: CutName;
    onModalClose: () => void;
}

export const TransactionModal = ({
    mode,
    cut,
    onModalClose,
}: TransactionModalProps) => {
    const {
        dispatch,
        state: { market, pack, player, spaceAvailable },
    } = useGameState();
    if (
        pack === undefined ||
        market === undefined ||
        player === undefined ||
        spaceAvailable === undefined
    ) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();
    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();

    const { price, quantity } = market[cut];
    const stock = mode === "buy" ? quantity : pack[cut];

    const maxAfford = Math.floor(player.funds / price);
    const maxTransact =
        mode === "sell"
            ? pack[cut]
            : Math.min(quantity, maxAfford, spaceAvailable);

    const [inputValue, setInputValue] = useState<number | undefined>();
    const [isAmountValid, setIsAmountValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        "Something went wrong.",
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleMaxClick = () => {
        unstable_batchedUpdates(() => {
            setErrorMessage(undefined);
            setInputValue(undefined);
        });

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

        if (mode === "buy") {
            if (inputValue > maxAfford) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Too expensive. You can only afford ${maxAfford} ${
                            maxAfford > 1 ? "lbs" : "lb"
                        } of ${cut}. Try the Max button.`,
                    );
                    setIsAmountValid(false);
                });
                return;
            }
            if (inputValue > spaceAvailable) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Not enough room. You can only carry ${spaceAvailable} more lbs.`,
                    );
                    setIsAmountValid(false);
                });
                return;
            }
            if (inputValue > stock) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Not enough ${cut} in stock. Only ${stock} ${
                            stock > 1 ? "lbs" : "lb"
                        } available.`,
                    );
                    setIsAmountValid(false);
                });
                return;
            }
        } else {
            if (inputValue > pack[cut]) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `You only have ${stock} ${
                            stock > 1 ? "lbs" : "lb"
                        }. Try the Max button.`,
                    );
                    setIsLoading(false);
                });
                return;
            }
        }

        setIsAmountValid(true);
    }, [inputValue]);

    const handleSubmit = async (amount: number, isMax: boolean) => {
        console.log("!!handleSumit", amount, maxTransact, isAmountValid);
        if (isLoading) return;
        if (!amount || (!isMax && !isAmountValid)) return;

        setIsLoading(true);

        if (mode === "buy") {
            const response = await handlePushCallback(Callback.buyCut, {
                cut,
                amount,
            });
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            unstable_batchedUpdates(() => {
                setInputValue(undefined);
                setIsLoading(false);
                dispatch({ type: "updateStateData", stateData: response });
                onModalClose();
            });
        } else {
            const response = await handlePushCallback(Callback.sellCut, {
                cut,
                amount,
            });
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            unstable_batchedUpdates(() => {
                setInputValue(undefined);
                setIsLoading(false);
                dispatch({ type: "updateStateData", stateData: response });
                onModalClose();
            });
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

    const title = `${mode === "buy" ? "Buy" : "Sell"} ${cut}`;

    return (
        <div
            css={{
                position: "fixed",
                insetBlockStart: 0,
                insetBlockEnd: 0,
                insetInlineStart: 0,
                insetInlineEnd: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1000,
            }}
        >
            <div
                css={{
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
                }}
            >
                <PrintLine
                    text={title}
                    size={LineSize.Title}
                    showPrompt={false}
                />

                {errorMessage && (
                    <PrintLine
                        text={errorMessage}
                        size={LineSize.Body}
                        showPrompt={false}
                    />
                )}

                <PrintLine
                    text={`Price: ${formatMoney(price)}`}
                    size={LineSize.Body}
                />

                <PrintLine
                    text={`${mode === "buy" ? "In Stock:" : "In Pack:"} stock`}
                    size={LineSize.Body}
                />

                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h4
                        css={{
                            marginBlock: 0,
                            marginInlineEnd: "20px",
                        }}
                    >
                        {">"}
                    </h4>
                    <Button
                        label={`${mode} Max ${maxTransact}`}
                        disabled={isLoading}
                        clickCB={handleMaxClick}
                    />
                </div>

                <div
                    css={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        css={{
                            display: "flex",
                            alignItems: "center",
                            marginBlockStart: "20px",
                        }}
                    >
                        <h4
                            css={{
                                marginBlock: 0,
                                marginInlineEnd: "20px",
                                animation: isAmountValid
                                    ? ""
                                    : `${Animations.blink} 1s linear infinite`,
                            }}
                        >
                            {">"}
                        </h4>

                        <TextInput
                            placeholder={"How many?"}
                            type={"number"}
                            value={`${inputValue}`}
                            changeCB={handleInputChange}
                            keyDownCB={handleKeyPress}
                        />
                    </div>

                    <div
                        css={{
                            display: "flex",
                            alignItems: "center",
                            marginBlockStart: "20px",
                            opacity: isAmountValid ? 1 : 0,
                        }}
                    >
                        <h4
                            css={{
                                marginBlock: 0,
                                marginInlineEnd: "20px",
                                animation: `${Animations.blink} 1s linear infinite`,
                            }}
                        >
                            {">"}
                        </h4>

                        <Button
                            label={mode}
                            clickCB={() => handleSubmit(inputValue ?? 0, false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
