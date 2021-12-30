/** @jsx jsx */
import { jsx } from "@emotion/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary, TextInput } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { formatMoney } from "../Utils";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
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

    const { price, quantity } = market[cut];
    const stock = mode === "buy" ? quantity : pack[cut];

    const maxAfford = Math.floor(player.funds / price);
    const handleMaxClick = () => {
        if (errorMessage) setErrorMessage(undefined);

        setAmount(() => {
            if (mode === "sell") return pack[cut];

            return Math.min(quantity, maxAfford, spaceAvailable);
        });
    };

    const [amount, setAmount] = useState<number | undefined>(undefined);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (errorMessage) setErrorMessage(undefined);

        const value = parseInt(event.target.value);
        setAmount(value);
    };
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined,
    );

    const [isLoading, setIsLoading] = useState(false);
    const { handlePushCallback } = useChannel();
    const handleSubmit = async () => {
        if (isLoading) return;
        if (!amount) return;
        setIsLoading(true);

        if (mode === "buy") {
            if (amount > maxAfford) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Too expensive. You can only afford ${maxAfford} ${
                            maxAfford > 1 ? "lbs" : "lb"
                        } of ${cut}. Use the MAX button.`,
                    );
                    setIsLoading(false);
                });
                return;
            }
            if (amount > spaceAvailable) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Not enough room. You can only carry ${spaceAvailable} more lbs.`,
                    );
                    setIsLoading(false);
                });
                return;
            }
            if (amount > stock) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `Not enough ${cut} in stock. Only ${stock} ${
                            stock > 1 ? "lbs" : "lb"
                        } available.`,
                    );
                    setIsLoading(false);
                });
                return;
            }

            const response = await handlePushCallback(Callback.buyCut, {
                cut,
                amount,
            });
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            unstable_batchedUpdates(() => {
                setAmount(undefined);
                setIsLoading(false);
                dispatch({ type: "updateStateData", stateData: response });
                onModalClose();
            });
        } else {
            if (amount > pack[cut]) {
                unstable_batchedUpdates(() => {
                    setErrorMessage(
                        `You only have ${stock} ${
                            stock > 1 ? "lbs" : "lb"
                        }. Use the MAX button.`,
                    );
                    setIsLoading(false);
                });
                return;
            }

            const response = await handlePushCallback(Callback.sellCut, {
                cut,
                amount,
            });
            if (response === undefined) {
                dispatch({ type: "changeScreen", screen: Screen.Error });
                return;
            }
            unstable_batchedUpdates(() => {
                setAmount(undefined);
                setIsLoading(false);
                dispatch({ type: "updateStateData", stateData: response });
                onModalClose();
            });
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") handleSubmit();
        switch (event.key) {
            case "Enter":
                handleSubmit();
                return;
            case "Escape":
                setAmount(undefined);
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
                    padding: "10px",
                    backgroundColor: Colors.Background.base,
                    borderColor: Colors.Border.subtle,
                    borderRadius: "4px",
                    borderStyle: "outset",
                    borderWidth: "2px",
                    boxShadow: "2px 2px 12px 4px rgba(0, 0, 0, 0.4)",
                    zIndex: 1001,
                }}
            >
                <div css={{ display: "flex", justifyContent: "flex-end" }}>
                    <ButtonPrimary
                        type={"Sized"}
                        label={"Close"}
                        border={"None"}
                        clickCB={onModalClose}
                        isDisabled={isLoading}
                    />
                </div>
                <div
                    css={{
                        display: "flex",
                        justifyContent: "center",
                        marginBlock: "20px",
                        paddingBlockEnd: "10px",
                        borderColor: "transparent",
                        borderBlockEndColor: Colors.Border.subtle,
                        borderStyle: "solid",
                        borderWidth: "1px",
                    }}
                >
                    <h2
                        css={{
                            marginBlock: 0,
                            fontVariantCaps: "small-caps",
                            letterSpacing: "4px",
                            textTransform: "capitalize",
                            wordSpacing: "8px",
                        }}
                    >
                        {mode} {cut}
                    </h2>
                </div>

                {errorMessage && (
                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "5px",
                            color: Colors.Text.danger,
                        }}
                    >
                        {errorMessage}
                    </p>
                )}

                <p>Price: {formatMoney(price)}</p>
                <p>
                    {mode === "buy" ? "In Stock:" : "In Pack:"} {stock}
                </p>
                <TextInput
                    placeholder={"How much?"}
                    type={"number"}
                    value={`${amount}`}
                    changeCB={handleInputChange}
                    keypressCB={handleKeyPress}
                />
                <div
                    css={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBlockStart: "30px",
                        marginBlockEnd: "10px",
                    }}
                >
                    <div css={{ marginInlineEnd: "20px" }}>
                        <ButtonPrimary
                            type={"Sized"}
                            border={"None"}
                            label={"Max"}
                            isDisabled={isLoading}
                            clickCB={handleMaxClick}
                        />
                    </div>
                    <ButtonPrimary
                        type={"Full"}
                        border={"Thin"}
                        scheme={"Inverse"}
                        label={mode}
                        isLoading={isLoading}
                        clickCB={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};
