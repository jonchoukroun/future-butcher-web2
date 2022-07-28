/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Button } from "./Button";
import { PackDetails, WeaponDetails } from "../Fixtures/store";
import { formatMoney } from "../Utils/formatMoney";

import * as Colors from "../Styles/colors";

interface SingleButtonListItemProps {
    listing: StorePackType | StoreWeaponType;
    isLast: boolean;
    onModalOpen: <T extends StorePackType | StoreWeaponType>(
        modalProps: T,
    ) => void;
}

export function SingleButtonListItem({
    listing,
    isLast,
    onModalOpen,
}: SingleButtonListItemProps) {
    const [, { price }] = listing;
    const displayName = getDisplayName(listing);
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

function getDisplayName<T extends StorePackType | StoreWeaponType>([name]: T) {
    const pack = PackDetails[name as PackName];
    return pack === undefined
        ? WeaponDetails[name as WeaponName].name
        : pack.name;
}
