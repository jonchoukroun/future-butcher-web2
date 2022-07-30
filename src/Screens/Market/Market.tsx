/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

import { CutList } from "./CutList";
import { MarketModal, TransactionType } from "./MarketModal";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";

import * as Colors from "../../Styles/colors";
import { CutType } from "../../GameData";

export const Market = () => {
    const [modalState, setModalState] = useState<{
        cut: CutType;
        transaction: TransactionType;
    }>();

    const handleTransactionSelect = (
        transaction: TransactionType,
        cut: CutType,
    ) => {
        setModalState({ cut, transaction });
    };

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
            <div
                css={{
                    marginBlockStart: "5px",
                    marginBlockEnd: layout === "full" ? "20px" : "5px",
                    textAlign: "center",
                }}
            >
                {layout === "full" && (
                    <h2
                        css={{
                            marginBlock: 0,
                            color: Colors.Text.base,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            wordSpacing: "4px",
                        }}
                    >
                        Meat Market
                    </h2>
                )}
                <small css={{ color: Colors.Text.subtle }}>
                    Buy low (*), sell high.
                </small>
            </div>

            <CutList handleTransactionSelect={handleTransactionSelect} />

            {modalState && (
                <MarketModal
                    transaction={modalState.transaction}
                    cut={modalState.cut}
                    onModalClose={() => setModalState(undefined)}
                />
            )}
        </div>
    );
};
