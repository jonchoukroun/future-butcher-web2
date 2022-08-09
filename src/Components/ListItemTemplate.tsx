/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button, ButtonProps } from "./Button";
import { PackDetails, WeaponDetails } from "../Fixtures/store";
import {
    CutType,
    MarketListing,
    PackListing,
    WeaponListing,
} from "../GameData";
import { isPackListingType, PackType, WeaponType } from "../GameData/Store";
import { formatMoney } from "../Utils/formatMoney";

import * as Animations from "../Styles/animations";
import * as Colors from "../Styles/colors";

export type TransactionRecordType =
    | {
          item: CutType | PackType | WeaponType | undefined;
          isSale?: boolean;
      }
    | undefined;

interface ListItemTemplateProps {
    listing: MarketListing | PackListing | WeaponListing;
    // Hide border under last item
    isLast: boolean;
    // Indicator that a transaction succeeded
    transactionRecord: TransactionRecordType;
    // Primary button is required and aligned to the right
    primaryButtonProps: ButtonProps;
    // Secondary button is optional and aligned left
    secondaryButtonProps?: ButtonProps;
}

export function ListItemTemplate({
    listing,
    isLast,
    transactionRecord,
    primaryButtonProps,
    secondaryButtonProps,
}: ListItemTemplateProps) {
    const displayName = getDisplayName(listing);
    const { price } = listing;

    const showAnimation = !!(transactionRecord?.item === listing.name);
    const animationName = !!transactionRecord?.isSale
        ? `${Animations.sellColorFlash}, ${Animations.bounceUp}`
        : `${Animations.buyColorFlash}, ${Animations.bounceDown}`;

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
                            textTransform: "capitalize",
                            marginBlockEnd: secondaryButtonProps ? "5px" : 0,
                            animationName: showAnimation
                                ? animationName
                                : undefined,
                            animationDuration: showAnimation
                                ? "500ms"
                                : undefined,
                            animationIterationCount: showAnimation
                                ? "500ms"
                                : undefined,
                            animationTimingFunction: showAnimation
                                ? "ease-out"
                                : undefined,
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
