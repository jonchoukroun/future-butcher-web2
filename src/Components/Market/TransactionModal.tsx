/** @jsx jsx */
import { jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { Button, ButtonScheme, ButtonSize, TextInput } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { formatMoney } from "../Utils";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Animations from "../../Styles/animations";
import * as Colors from "../../Styles/colors";

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

    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState<number | undefined>();
    const [isAmountValid, setIsAmountValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const { price, quantity } = market[cut];
    const stock = mode === "buy" ? quantity : pack[cut];

    const maxAfford = Math.floor(player.funds / price);
    const maxTransact =
        mode === "sell"
            ? pack[cut]
            : Math.min(quantity, maxAfford, spaceAvailable);

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

    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();
    const inlineSizeOffset = layout === "full" ? 24 : 15;

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
                <div
                    css={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBlockEnd: "30px",
                        paddingBlockEnd: "10px",
                        borderColor: Colors.Border.subtle,
                        borderBottomStyle: "dashed",
                        borderWidth: "2px",
                    }}
                >
                    <h2
                        css={{
                            marginBlock: 0,
                            textTransform: "capitalize",
                        }}
                    >
                        {mode} {cut}
                    </h2>
                    <Button
                        size={ButtonSize.Compact}
                        label={"Close"}
                        clickCB={onModalClose}
                        isDisabled={isLoading}
                    />
                </div>

                {errorMessage && (
                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "20px",
                            color: Colors.Text.danger,
                        }}
                    >
                        {errorMessage}
                    </p>
                )}

                <h4
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "20px",
                    }}
                >
                    Price: {formatMoney(price)}
                </h4>
                <h4
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "20px",
                    }}
                >
                    {mode === "buy" ? "In Stock:" : "In Pack:"} {stock}
                </h4>
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
                            animation: showInput
                                ? ""
                                : `${Animations.blink} 1s linear infinite`,
                        }}
                    >
                        {">"}
                    </h4>
                    <Button
                        size={ButtonSize.Compact}
                        scheme={ButtonScheme.Inverse}
                        label={`${mode} Max ${maxTransact}`}
                        isDisabled={isLoading}
                        clickCB={handleMaxClick}
                    />

                    {!showInput && (
                        <div css={{ marginInlineStart: "auto" }}>
                            <Button
                                size={ButtonSize.Compact}
                                label={"Custom"}
                                clickCB={() => setShowInput((curr) => !curr)}
                                isDisabled={isLoading}
                            />
                        </div>
                    )}
                </div>
                {showInput && (
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
                                scheme={ButtonScheme.Inverse}
                                size={ButtonSize.Compact}
                                label={mode}
                                isLoading={isLoading}
                                clickCB={() =>
                                    handleSubmit(inputValue ?? 0, false)
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
