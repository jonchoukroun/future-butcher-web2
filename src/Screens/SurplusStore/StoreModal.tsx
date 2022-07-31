/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment } from "react";

import {
    Button,
    ButtonPrompt,
    ButtonPromptSize,
    ButtonScheme,
    ButtonSize,
    PrintLine,
    Prompt,
    TextInput,
} from "../../Components";
import { LineSize } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import {
    PackDetails,
    PackDetailsType,
    WeaponDetails,
    WeaponDetailsType,
} from "../../Fixtures/store";
import { PackListing, WeaponListing } from "../../GameData";

import * as Colors from "../../Styles/colors";
import { formatMoney } from "../../Utils/formatMoney";

interface StoreModalProps {
    listing: PackListing | WeaponListing;
    onModalClose: () => void;
}

export function StoreModal({ listing, onModalClose }: StoreModalProps) {
    const { getContentSize, layout } = useWindowSize();
    const { inlineSize } = getContentSize();

    const itemDetails = getItemDetails(listing);

    const harvestableCuts = `Can harvest: ${getHarvestableCuts(listing)}.`;

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
                <PrintLine
                    text={itemDetails.displayName}
                    size={LineSize.Title}
                    prompt={"hidden"}
                    marginBlockEnd={"20px"}
                />

                {isPack(listing) && (
                    <PrintLine
                        text={(itemDetails as PackDetailsType).description}
                        size={LineSize.Body}
                        prompt={"passed"}
                    />
                )}

                <PrintLine
                    text={`Price: ${formatMoney(listing.price)}`}
                    size={LineSize.Body}
                    prompt={"passed"}
                />

                {isPack(listing) ? (
                    <PrintLine
                        text={`Carrying capacity: ${
                            (itemDetails as PackDetailsType).packSpace
                        } lbs`}
                        size={LineSize.Body}
                        prompt={"passed"}
                    />
                ) : (
                    <Fragment>
                        <PrintLine
                            text={`Damage: ${
                                (itemDetails as WeaponDetailsType).damage
                            }0%`}
                            size={LineSize.Body}
                            prompt={"passed"}
                        />

                        {harvestableCuts && (
                            <PrintLine
                                text={harvestableCuts}
                                size={LineSize.Body}
                                prompt={"passed"}
                            />
                        )}
                    </Fragment>
                )}

                <ButtonPrompt
                    label={"Close"}
                    size={ButtonPromptSize.Small}
                    blink={false}
                    clickCB={onModalClose}
                />
            </div>
        </div>
    );
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

function getHarvestableCuts(
    listing: PackListing | WeaponListing,
): string | undefined {
    if (isPack(listing)) return undefined;
    return listing.cuts.join(", ");
}

function isPack(item: PackListing | WeaponListing): item is PackListing {
    return (item as PackListing).pack_space !== undefined;
}
