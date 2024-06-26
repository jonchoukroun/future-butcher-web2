/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useState } from "react";

import { QuitGameModal } from "./QuitGameModal";
import {
    Button,
    ButtonPrompt,
    ButtonPromptSize,
    ButtonScheme,
    ButtonSize,
} from "../../Components/";
import { LineSize, PrintLine, PromptScheme } from "../../Components/PrintLine";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { PackDetails, WeaponDetails } from "../../Fixtures/store";
import { StationDetails } from "../../Fixtures/subwayStations";
import { Screen } from "../../GameData";
import { isApiError } from "../../GameData/State";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";
import { getTimeLeft } from "../../Utils/getTimeLeft";

import * as Colors from "../../Styles/colors";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";

export const StatsScreen = () => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        dispatch,
        state: { currentStation, turnsLeft, player },
    } = useGameState();

    if (
        currentStation === undefined ||
        player === undefined ||
        turnsLeft === undefined
    ) {
        throw new Error("State is undefined");
    }

    const { getContentSize } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const { handlePushCallback } = useChannel();

    const station = StationDetails[currentStation];

    const { cash, debt, hasOil, health, pack, totalPackSpace, weapon } = player;
    const canPayDebt = debt > 0 && cash > debt;

    const packName = (
        Object.values(PackDetails).find(
            ({ packSpace }) => packSpace === totalPackSpace,
        ) || { name: "Backpack" }
    ).displayName;

    const sortedPack = Object.entries(pack).sort(
        ([, amount1], [, amount2]) => amount2 - amount1,
    );
    const packListString = sortedPack
        .filter(([, amount]) => amount > 0)
        .map(([Cuts, amount]) => `${amount} ${Cuts}`)
        .join(", ");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancelEndGame = () => {
        if (!isModalOpen) return;
        setIsModalOpen(false);
    };

    const handlePayDebtClick = async () => {
        if (isLoading) return;
        if (!debt) {
            handleMessage(
                "Tried to pay non-existent debt from StatsScreen",
                MessageLevel.Error,
            );
            return;
        }

        if (debt > cash) {
            handleMessage("Failed debt payment validation", MessageLevel.Error);
            return;
        }

        setIsLoading(true);
        const response = await handlePushCallback("payDebt", {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "updateStateData", stateData: response });
        setIsLoading(false);
    };

    const handleHighScoresClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.HighScores });
    };

    const handleCreditsClick = () => {
        dispatch({ type: "changeScreen", screen: Screen.Credits });
    };

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: `${inlineSize}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingInline: "10px",
            }}
        >
            <div
                css={{
                    inlineSize: "100%",
                    marginBlockStart: "30px",
                    marginBlockEnd: "20px",
                    borderBottomColor: Colors.Border.subtle,
                    borderBottomStyle: "dashed",
                    borderBottomWidth: "2px",
                }}
            >
                <PrintLine
                    text={"Game Stats"}
                    size={LineSize.Title}
                    promptScheme={PromptScheme.Hidden}
                />
            </div>

            <div
                css={{
                    blockSize: "100%",
                    inlineSize: "100%",
                    marginBlockStart: "auto",
                }}
            >
                <div
                    css={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBlockEnd: "15px",
                    }}
                >
                    <Button
                        label={"Scores"}
                        size={ButtonSize.Set}
                        scheme={ButtonScheme.Inverse}
                        clickCB={handleHighScoresClick}
                    />
                    <Button
                        label={"Credits"}
                        size={ButtonSize.Set}
                        scheme={ButtonScheme.Inverse}
                        clickCB={handleCreditsClick}
                    />
                </div>
                <div
                    css={{
                        marginBlockEnd: "16px",
                        border: 0,
                        borderBottomColor: Colors.Border.subtle,
                        borderBottomStyle: "dashed",
                        borderBottomWidth: "2px",
                    }}
                >
                    <PrintLine
                        text={`Health: ${health}%`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <PrintLine
                        text={`Cash: ${formatMoney(cash)}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <Fragment>
                        <PrintLine
                            text={`Debt: ${formatMoney(debt)}`}
                            size={LineSize.Body}
                            danger={true}
                            promptScheme={PromptScheme.Past}
                        />

                        <ButtonPrompt
                            label={
                                debt === 0
                                    ? "Debt is paid off"
                                    : canPayDebt
                                    ? "Pay debt with FlayPal"
                                    : "Can't pay debt"
                            }
                            size={ButtonPromptSize.Full}
                            blink={cash > debt}
                            disabled={!canPayDebt}
                            loading={isLoading}
                            clickCB={handlePayDebtClick}
                        />
                    </Fragment>
                </div>

                <div
                    css={{
                        marginBlockEnd: "16px",
                        border: 0,
                        borderBottomColor: Colors.Border.subtle,
                        borderBottomStyle: "dashed",
                        borderBottomWidth: "2px",
                    }}
                >
                    <PrintLine
                        text={`Current time: ${getTimeLeft(turnsLeft)}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <PrintLine
                        text={`Neighborhood: ${station.displayName}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    <PrintLine
                        text={`...${station.stationDescription}`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />
                </div>

                <div
                    css={{
                        marginBlockEnd: "16px",
                        border: 0,
                        borderBottomColor: Colors.Border.subtle,
                        borderBottomStyle: "dashed",
                        borderBottomWidth: "2px",
                    }}
                >
                    {weapon ? (
                        <Fragment>
                            <PrintLine
                                text={`Weapon: ${WeaponDetails[weapon].displayName}`}
                                size={LineSize.Body}
                                promptScheme={PromptScheme.Past}
                            />
                            <PrintLine
                                text={`Damage: ${WeaponDetails[weapon].damage}0%`}
                                size={LineSize.Body}
                                promptScheme={PromptScheme.Past}
                            />
                        </Fragment>
                    ) : hasOil ? (
                        <PrintLine
                            text={"Adrenal Gland Essential Oils"}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    ) : (
                        <PrintLine
                            text={"No weapon, no essential oil"}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    )}

                    <PrintLine
                        text={`Pack: ${packName} (${totalPackSpace} lbs)`}
                        size={LineSize.Body}
                        promptScheme={PromptScheme.Past}
                    />

                    {packListString.length ? (
                        <PrintLine
                            text={`Cuts: ${packListString}`}
                            size={LineSize.Body}
                            promptScheme={PromptScheme.Past}
                        />
                    ) : null}
                </div>

                <ButtonPrompt
                    label={"Quit the game?"}
                    size={ButtonPromptSize.Full}
                    blink={false}
                    danger={true}
                    clickCB={() => {
                        setIsModalOpen(true);
                    }}
                />
            </div>
            {isModalOpen && (
                <QuitGameModal onCloseModal={handleCancelEndGame} />
            )}
        </div>
    );
};
