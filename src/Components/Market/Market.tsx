/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { CutList } from "./CutList";
import { TransactionModal, TransactionMode } from "./TransactionModal";
import { useWindowSize } from "../Window/WindowSizeProvider";
import * as Colors from "../../Styles/colors";

export const Market = () => {
    const [transactionMode, setTransactionMode] = useState<
        TransactionMode | undefined
    >(undefined);

    const [transactionCut, setTransactionCut] = useState<string | undefined>(
        undefined,
    );

    const handleTransactionMode = (
        transactionMode: TransactionMode,
        transactionCut?: string,
    ) => {
        unstable_batchedUpdates(() => {
            setTransactionMode(transactionMode);
            setTransactionCut(transactionCut);
        });
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
                        Cuts Market
                    </h2>
                )}
                <small css={{ color: Colors.Text.subtle }}>
                    Buy low, sell high.
                </small>
            </div>

            <CutList handleTransactionMode={handleTransactionMode} />

            {transactionMode && transactionCut && (
                <TransactionModal
                    mode={transactionMode}
                    cut={transactionCut}
                    onModalClose={() => setTransactionMode(undefined)}
                />
            )}
        </div>
    );
};
