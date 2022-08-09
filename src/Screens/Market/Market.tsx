/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { CutList } from "./CutList";
import { MarketModal, TransactionType } from "./MarketModal";
import { useAlertService } from "../../AlertService/AlertServiceProvider";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { CutSurge } from "../../Fixtures/store";
import { CutType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

import * as Colors from "../../Styles/colors";
import { TransactionRecordType } from "../../Components/ListItemTemplate";

export const Market = () => {
    const {
        dispatch,
        state: { market, hasUnseenAlerts },
    } = useGameState();
    if (market === undefined) {
        throw new Error("State is undefined");
    }

    const { pushAlert } = useAlertService();

    const [transactionRecord, setTransactionRecord] =
        useState<TransactionRecordType>();

    const didRenderAlertsRef = useRef(false);

    const handleTransactionSuccess = (
        cut: CutType,
        transaction: TransactionType,
    ) => setTransactionRecord({ item: cut, isSale: transaction === "sell" });
    useEffect(() => {
        const interval = setInterval(() => {
            if (transactionRecord) {
                setTransactionRecord(undefined);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [transactionRecord]);

    useLayoutEffect(() => {
        if (!hasUnseenAlerts || didRenderAlertsRef.current) return;

        market.forEach((cut) => {
            const surge = CutSurge[cut.name];
            if (cut.price > surge.price) {
                pushAlert({
                    text: surge.messages[
                        Math.floor(Math.random() * surge.messages.length)
                    ],
                    isPersistent: true,
                });
                dispatch({ type: "setUnseenAlerts" });
                didRenderAlertsRef.current = true;
            }
        });
        dispatch({ type: "clearAlerts" });
    }, [dispatch, hasUnseenAlerts, market, pushAlert]);

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

            <CutList
                transactionRecord={transactionRecord}
                handleTransactionSelect={handleTransactionSelect}
            />

            {modalState && (
                <MarketModal
                    transaction={modalState.transaction}
                    cut={modalState.cut}
                    onTransactionSuccess={handleTransactionSuccess}
                    onModalClose={() => setModalState(undefined)}
                />
            )}
        </div>
    );
};
