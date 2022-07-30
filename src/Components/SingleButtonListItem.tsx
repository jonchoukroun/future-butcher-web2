/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button } from "./Button";
import { PackDetails, WeaponDetails } from "../Fixtures/store";
import { PackListing, WeaponListing } from "../GameData";
import { formatMoney } from "../Utils/formatMoney";

import * as Colors from "../Styles/colors";
import { isPackListingType, PackType, WeaponType } from "../GameData/Store";

interface SingleButtonListItemProps {
    listing: PackListing | WeaponListing;
    isLast: boolean;
    onModalOpen: <T extends PackListing | WeaponListing>(modalProps: T) => void;
}

export function SingleButtonListItem({
    listing,
    isLast,
    onModalOpen,
}: SingleButtonListItemProps) {
    const isPack = isPackListingType(listing);
    const { name, price } = listing;
    const displayName = getDisplayName(name, isPack);
    return (
        <li
            css={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                paddingInline: "10px",
                border: 0,
                borderBlockEndColor: isLast
                    ? "transparent"
                    : Colors.Border.subtle,
                borderBlockEndStyle: "dashed",
                borderBlockEndWidth: "2px",
            }}
        >
            <div css={{ display: "flex" }}>
                <div
                    css={{
                        inlineSize: "140px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <h2
                        css={{
                            margin: 0,
                            color: Colors.Text.base,
                            textTransform: "capitalize",
                        }}
                    >
                        {displayName}
                    </h2>
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
                                color: Colors.Text.base,
                                textTransform: "capitalize",
                            }}
                        >
                            {formatMoney(price)}
                        </h2>

                        <Button
                            label={"Details"}
                            disabled={false}
                            clickCB={() => onModalOpen(listing)}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
}

function getDisplayName(name: PackType | WeaponType, isPack: boolean) {
    if (isPack) return PackDetails[name as PackType].displayName;
    return WeaponDetails[name as WeaponType].displayName;
}
