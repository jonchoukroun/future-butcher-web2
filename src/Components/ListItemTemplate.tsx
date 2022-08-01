/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button, ButtonProps } from "./Button";
import { MarketListing, PackListing, WeaponListing } from "../GameData";
import { formatMoney } from "../Utils/formatMoney";

import * as Colors from "../Styles/colors";
import { isPackListingType, PackType, WeaponType } from "../GameData/Store";
import { PackDetails, WeaponDetails } from "../Fixtures/store";

interface ListItemTemplateProps {
    listing: MarketListing | PackListing | WeaponListing;
    // Hide border under last item
    isLast: boolean;
    // Primary button is required and aligned to the right
    primaryButtonProps: ButtonProps;
    // Secondary button is optional and aligned left
    secondaryButtonProps?: ButtonProps;
}

export function ListItemTemplate({
    listing,
    isLast,
    primaryButtonProps,
    secondaryButtonProps,
}: ListItemTemplateProps) {
    const displayName = getDisplayName(listing);
    const { price } = listing;

    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                marginInline: "10px",
                borderColor: "transparent",
                borderBlockEndColor: isLast
                    ? "transparent"
                    : Colors.Border.subtle,
                borderStyle: "dashed",
                borderWidth: "1px",
            }}
        >
            <div css={{ display: "flex" }}>
                <div
                    css={{
                        inlineSize: "140px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: secondaryButtonProps
                            ? "flex-start"
                            : "center",
                    }}
                >
                    <h2
                        css={{
                            margin: 0,
                            color: Colors.Text.base,
                            textTransform: "capitalize",
                            marginBlockEnd: secondaryButtonProps ? "5px" : 0,
                        }}
                    >
                        {displayName}
                    </h2>

                    {secondaryButtonProps && (
                        <Button
                            label={secondaryButtonProps.label}
                            disabled={secondaryButtonProps.disabled}
                            clickCB={secondaryButtonProps.clickCB}
                        />
                    )}
                </div>

                <div
                    css={{
                        inlineSize: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <div
                        css={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <h2
                            css={{
                                margin: 0,
                                marginBlockEnd: "5px",
                                color: Colors.Text.base,
                                textTransform: "capitalize",
                            }}
                        >
                            {formatMoney(price)}
                        </h2>

                        <Button
                            label={primaryButtonProps.label}
                            disabled={primaryButtonProps.disabled}
                            clickCB={primaryButtonProps.clickCB}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
}

function getDisplayName(item: MarketListing | PackListing | WeaponListing) {
    if ("quantity" in item) return item.name;
    if (isPackListingType(item)) {
        return PackDetails[item.name as PackType].displayName;
    } else {
        return WeaponDetails[item.name as WeaponType].displayName;
    }
}
