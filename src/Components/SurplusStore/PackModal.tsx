/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { useWindowSize } from "../Window/WindowSizeProvider";
import { PackDetails } from "../../Fixtures/store";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import { Callback, useChannel } from "../../PhoenixChannel/ChannelProvider";
import * as Colors from "../../Styles/colors";

interface PackModalProps {
    name: PackName;
    packSpace: number;
    price: number;
    onModalClose: () => void;
}

export const PackModal = ({
    name,
    packSpace,
    price,
    onModalClose,
}: PackModalProps) => {
    const {
        dispatch,
        state: { player, spaceAvailable },
    } = useGameState();

    if (player === undefined || spaceAvailable === undefined) {
        throw new Error("State is undefined");
    }

    const [isLoading, setIsLoading] = useState(false);
    const { handlePushCallback } = useChannel();
    const handleBuyClick = async () => {
        if (isLoading) return;

        if (player.funds < price || player.packSpace === packSpace) {
            onModalClose();
            return;
        }

        setIsLoading(true);
        const response = await handlePushCallback(Callback.buyPack, {
            pack: name,
        });
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        unstable_batchedUpdates(() => {
            setIsLoading(false);
            dispatch({ type: "updateStateData", stateData: response });
            onModalClose();
        });
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
                        flexDirection: "column",
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
                            textAlign: "center",
                            textTransform: "capitalize",
                            wordSpacing: "8px",
                        }}
                    >
                        {PackDetails[name].name}
                    </h2>
                    <p css={{ marginBlockEnd: "5px", textAlign: "center" }}>
                        {PackDetails[name].description}
                    </p>
                </div>

                <p>Pack Space: {packSpace} lbs</p>

                <p>Price: {formatMoney(price)}</p>

                <div
                    css={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBlockStart: "30px",
                        marginBlockEnd: "10px",
                    }}
                >
                    <ButtonPrimary
                        type={"Full"}
                        border={"Thin"}
                        scheme={"Inverse"}
                        label={"Buy"}
                        isLoading={isLoading}
                        clickCB={handleBuyClick}
                    />
                </div>
            </div>
        </div>
    );
};
