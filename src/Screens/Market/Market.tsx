/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useState } from "react";

import { CutList } from "./CutList";
import { MarketModal, TransactionType } from "./MarketModal";
import { useAlertService } from "../../AlertService/AlertServiceProvider";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { SurgeMinimums } from "../../Fixtures/store";
import { CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

import * as Colors from "../../Styles/colors";

export const Market = () => {
    const {
        state: { market },
    } = useGameState();
    if (market === undefined) {
        throw new Error("State is undefined");
    }

    const { pushAlert } = useAlertService();
    // FIXME: this should only run once, per turn
    useEffect(() => {
        market.forEach((cut) => {
            if (cut.price > SurgeMinimums[cut.name]) {
                pushAlert({
                    text: `${cut.name} prices are through the roof! Hope you have some to sell.`,
                    isPersistent: true,
                });
            }
        });
    }, []);

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
