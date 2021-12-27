/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useReducer, useState } from "react";

import { PackModal } from "./PackModal";
import { PacksList } from "./PacksList";
import { ButtonPrimary } from "../Form";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export type PackModalState = {
    mode: "buy" | "drop" | undefined;
    name: PackName | undefined;
    packSpace: number | undefined;
    price: number | undefined;
};

export const SurplusStore = () => {
    const [menuType, setMenuType] = useState<"packs" | "weapons" | undefined>(
        undefined,
    );
    const handleStoreBackClick = () => setMenuType(undefined);

    const buyPackState: PackModalState = {
        mode: undefined,
        name: undefined,
        packSpace: undefined,
        price: undefined,
    };
    const [state, dispatch] = useReducer(buyPackReducer, buyPackState);
    const handlePackModalOpen = (modalProps: PackModalState) => {
        dispatch({ type: "open", props: modalProps });
    };
    const handlePackModalClose = () => dispatch({ type: "close" });

    const { heightAdjustment, layout } = useWindowSize();
    return (
        <div
            css={{
                blockSize: `calc(100% - ${heightAdjustment}px)`,
                maxBlockSize: "600px",
                display: "flex",
                flexDirection: "column",
                paddingInline: "8px",
            }}
        >
            {layout === "full" && (
                <h2
                    css={{
                        marginBlock: 0,
                        color: Colors.Text.base,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        wordSpacing: "4px",
                    }}
                >
                    Gus&apos; Army Surplus
                </h2>
            )}

            {menuType === undefined ? (
                <Fragment>
                    <p css={{ marginBlock: "40px" }}>
                        Welcome to the last bastion of freedom in LA! We have
                        the best gear to ensure your liberty.
                    </p>

                    <p>You look like you could use more carrying space.</p>
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "center",
                            marginBlockEnd: "40px",
                        }}
                    >
                        <ButtonPrimary
                            type={"Block"}
                            label={"Buy Packs"}
                            scheme={"Inverse"}
                            clickCB={() => setMenuType("packs")}
                        />
                    </div>

                    <p>
                        Ain&apos;t no more 2nd ammendment, but we still have all
                        your personal defense needs.
                    </p>
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "center",
                            marginBlockEnd: "40px",
                        }}
                    >
                        <ButtonPrimary
                            type={"Block"}
                            label={"Buy Weapons"}
                            scheme={"Inverse"}
                            clickCB={() => setMenuType("weapons")}
                        />
                    </div>
                </Fragment>
            ) : menuType === "packs" ? (
                <Fragment>
                    <PacksList
                        handleModalOpen={handlePackModalOpen}
                        onStoreBackClick={handleStoreBackClick}
                    />

                    {state.mode &&
                        state.name &&
                        state.packSpace &&
                        state.price && (
                            <PackModal
                                mode={state.mode}
                                name={state.name}
                                packSpace={state.packSpace}
                                price={state.price}
                                onModalClose={handlePackModalClose}
                            />
                        )}
                </Fragment>
            ) : (
                <div css={{ display: "flex", justifyContent: "flex-start" }}>
                    <ButtonPrimary
                        type={"Sized"}
                        label={"Back"}
                        border={"None"}
                        clickCB={handleStoreBackClick}
                    />
                </div>
            )}
        </div>
    );
};

type PackAction = { type: "close" } | { type: "open"; props: PackModalState };

function buyPackReducer(state: PackModalState, action: PackAction) {
    if (action.type === "close")
        return {
            mode: undefined,
            name: undefined,
            packSpace: undefined,
            price: undefined,
        };

    return action.props;
}
