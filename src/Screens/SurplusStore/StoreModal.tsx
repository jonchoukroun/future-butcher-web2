/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useState } from "react";

import {
    Button,
    ButtonPrompt,
    ButtonPromptSize,
    ButtonScheme,
    ButtonSize,
    PrintLine,
} from "../../Components";
import { LineSize, PromptScheme } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import {
    PackDetails,
    PackDetailsType,
    WeaponDetails,
    WeaponDetailsType,
} from "../../Fixtures/store";
import {
    PackListing,
    PackType,
    PlayerType,
    Screen,
    WeaponListing,
    WeaponType,
} from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { CallbackType, useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

import * as Colors from "../../Styles/colors";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { ApiErrorType, ApiStateType, isApiError } from "../../GameData/State";

interface StoreModalProps {
    listing: PackListing | WeaponListing;
    onModalClose: () => void;
    onTransactionSuccess: (item: PackType | WeaponType) => void;
}

export function StoreModal({
    listing,
    onModalClose,
    onTransactionSuccess,
}: StoreModalProps) {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();
    const { getContentSize, layout, windowSize } = useWindowSize();
    const { inlineSize } = getContentSize();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();

    const isPackListing = isPack(listing);
    const isOwned = alreadyOwned(listing, player);
    const canAfford = player.cash >= listing.price;
    const isPackSoldOut = isPackListing
        ? isOwned || player.totalPackSpace > listing.pack_space
        : false;

    const handleBuyClick = async () => {
        if (isLoading) return;
        if (isOwned) {
            setError("You already own this item.");
            return;
        }
        if (!canAfford) {
            setError("You can't afford this item.");
            return;
        }
        if (isPackSoldOut) {
            setError("We're all out of this item.");
            return;
        }

        setError(undefined);
        setIsLoading(true);

        let response: ApiStateType | ApiErrorType | undefined;
        if (isPackListing) {
            response = await handlePushCallback("buyPack", {
                pack: listing.name,
            });
        } else {
            const callback: CallbackType = player.weapon
                ? "replaceWeapon"
                : "buyWeapon";
            response = await handlePushCallback(callback, {
                weapon: listing.name,
            });
        }

        setIsLoading(false);

        // TODO: API error handling
        if (isApiError(response)) {
            switch (response.error) {
                case ":insufficient_cash":
                    handleMessage(
                        "Pricing validation failed",
                        MessageLevel.Error,
                    );
                    break;

                case ":already_owns_weapon":
                    handleMessage(
                        "Already owned weapon validation failed",
                        MessageLevel.Error,
                    );
                    break;

                case ":same_weapon_type":
                    handleMessage(
                        "Same weapon validation failed",
                        MessageLevel.Error,
                    );
                    break;

                case ":must_upgrade_pack":
                    handleMessage(
                        "Pack upgrade validation failed",
                        MessageLevel.Error,
                    );
                    break;

                default:
                    handleMessage(
                        `Unhandled API error: ${response.error}`,
                        MessageLevel.Error,
                    );
            }
            setError("Something went wrong. Try again later.");
        } else if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
        } else {
            onTransactionSuccess(listing.name);
            dispatch({
                type: "updateStateData",
                stateData: response as ApiStateType,
            });
            onModalClose();
        }
    };

    const itemDetails = getItemDetails(listing);

    const buttonLabel =
        player.weapon && !isPackListing
            ? "Replace current weapon"
            : `Buy ${itemDetails.displayName}`;

    const inlineSizeOffset = layout === "full" ? 24 : 15;

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
                backgroundColor: "rgba(0, 0, 0, 0.4)",
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
                            text={itemDetails.displayName}
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

                    {error && (
                        <PrintLine
                            text={error}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Hidden}
                            danger
                            marginBlockEnd={"12px"}
                        />
                    )}

                    <PrintLine
                        text={itemDetails.description}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    {isPackListing ? (
                        <PrintLine
                            text={`Carrying capacity: ${
                                (itemDetails as PackDetailsType).packSpace
                            } lbs`}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    ) : (
                        <PrintLine
                            text={`Damage: ${
                                (listing as WeaponListing).damage
                            }0%`}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    )}

                    <PrintLine
                        text={`Price: ${formatMoney(listing.price)}${
                            !isPackListing &&
                            player.weapon &&
                            listing.name !== player.weapon
                                ? " - current wepon value"
                                : ""
                        }`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    {isOwned && (
                        <PrintLine
                            text={"You already own this item."}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    )}

                    {!isOwned && !canAfford && (
                        <PrintLine
                            text={"You can't afford this item."}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    )}

                    {!isOwned && isPackSoldOut && (
                        <PrintLine
                            text={"We're all sold out!"}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    )}

                    {!isOwned && canAfford && !isPackSoldOut ? (
                        <ButtonPrompt
                            label={buttonLabel}
                            size={ButtonPromptSize.Small}
                            loading={isLoading}
                            clickCB={handleBuyClick}
                        />
                    ) : (
                        <ButtonPrompt
                            label={`Back to ${
                                isPackListing ? "packs" : "weapons"
                            }`}
                            size={ButtonPromptSize.Full}
                            clickCB={onModalClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function alreadyOwned<T extends PackListing | WeaponListing>(
    item: T,
    player: PlayerType,
): boolean {
    if (isPack(item)) {
        return player.totalPackSpace === item.pack_space;
    } else {
        return player.weapon === item.name;
    }
}

function getItemDetails<T extends PackListing | WeaponListing>(
    item: T,
): PackDetailsType | WeaponDetailsType {
    if (isPack(item)) {
        const details: PackDetailsType = PackDetails[item.name];
        return details;
    } else {
        const details: WeaponDetailsType = WeaponDetails[item.name];
        return details;
    }
}

function isPack(item: PackListing | WeaponListing): item is PackListing {
    return (item as PackListing).pack_space !== undefined;
}
