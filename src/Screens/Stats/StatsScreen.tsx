/** @jsx jsx */
import { jsx } from "@emotion/react";
import { faClock, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";

import { EndGameModal } from "./EndGameModal";
import { ButtonPrimary } from "../../Components/ButtonPrimary";
import { formatMoney, getTimeLeft } from "../../Utils";
import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { PackDetails, WeaponDetails } from "../../Fixtures/store";
import { subwayStations } from "../../Fixtures/subwayStations";
import { useChannel, Callback } from "../../PhoenixChannel/ChannelProvider";
import { useGameState, Screen } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const StatsScreen = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { layout } = useWindowSize();
    const {
        state: { currentStation, turnsLeft, pack, player, spaceAvailable },
        dispatch,
    } = useGameState();

    if (
        currentStation === undefined ||
        pack === undefined ||
        player === undefined ||
        spaceAvailable === undefined ||
        turnsLeft === undefined
    ) {
        throw new Error("State is undefined");
    }

    const station = subwayStations.find(
        (station) => station.key === currentStation,
    );

    const packName = (
        Object.values(PackDetails).find(
            ({ packSpace }) => packSpace === player.packSpace,
        ) || { name: "Backpack" }
    ).name;

    const sortedPack = Object.entries(pack).sort(
        ([, amount1], [, amount2]) => amount2 - amount1,
    );
    const packListstring = sortedPack
        .filter(([, amount]) => amount > 0)
        .map(([cutName, amount]) => `${amount} ${cutName}`)
        .join(", ");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleConfirmEndGame = () => {
        if (isModalOpen) return;
        setIsModalOpen(true);
    };
    const handleCancelEndGame = () => {
        if (!isModalOpen) return;
        setIsModalOpen(false);
    };

    const { handlePushCallback } = useChannel();

    const canAfford = player?.funds > player?.debt;
    const handlePayDebtClick = async () => {
        if (isLoading) return;
        if (!canAfford) return;

        setIsLoading(true);
        const response = await handlePushCallback(Callback.payDebt, {});
        if (response === undefined) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "updateStateData", stateData: response });
        setIsLoading(false);
    };

    const containerPaddingInline = layout === "full" ? "16px" : "4px";
    const paddingBlock = layout === "full" ? "28px" : "7px";
    const paddingInline = layout === "full" ? "28px" : "7px";

    return (
        <Fragment>
            <div
                css={{
                    blockSize: "calc(100% - 70px)",
                    inlineSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    paddingInline: containerPaddingInline,
                    "& p": {
                        wordSpacing: 0,
                    },
                }}
            >
                <div
                    css={{
                        inlineSize: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBlock,
                        paddingInline,
                        borderColor: "transparent",
                        borderBlockEndColor: Colors.Border.subtle,
                        borderRadius: "1px",
                        borderStyle: "solid",
                        borderWidth: "1px",

                        "& button": {
                            marginBlockStart:
                                layout === "full" ? "-10px" : "-2px",
                        },
                    }}
                >
                    <div>
                        <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                            <span css={{ marginInlineEnd: "5px" }}>
                                <FontAwesomeIcon icon={faClock} />
                            </span>
                            {getTimeLeft(turnsLeft)}
                        </p>
                        <p css={{ marginBlock: 0, color: Colors.Text.subtle }}>
                            {turnsLeft > 0
                                ? `${turnsLeft} hours left`
                                : "Time's up"}
                        </p>
                    </div>
                    <ButtonPrimary
                        type={"Sized"}
                        label={"End Game"}
                        scheme={"Inverse"}
                        border={"None"}
                        isDanger={true}
                        clickCB={handleConfirmEndGame}
                    />
                </div>

                <div
                    css={{
                        inlineSize: "100%",
                        paddingBlock,
                        paddingInline,
                        borderColor: "transparent",
                        borderBlockEndColor: Colors.Border.subtle,
                        borderRadius: "1px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                    }}
                >
                    <div
                        css={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBlockEnd: "5px",
                        }}
                    >
                        <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                            {player && formatMoney(player.funds)}
                        </p>

                        <p css={{ marginBlock: 0 }}>
                            <span css={{ marginInlineEnd: "5px" }}>
                                <FontAwesomeIcon icon={faHeart} fontSize={16} />
                            </span>
                            {player && player.health}
                        </p>
                    </div>

                    <div
                        css={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBlockEnd: "5px",
                        }}
                    >
                        <p
                            css={{
                                marginBlock: 0,
                                color: Colors.Text.danger,
                            }}
                        >
                            Debt: {player && formatMoney(player.debt)}{" "}
                            {player.debt > 0 && (
                                <span css={{ color: Colors.Text.subtle }}>
                                    (5%)
                                </span>
                            )}
                        </p>

                        {player.debt > 0 &&
                            canAfford &&
                            (isLoading ? (
                                <p
                                    css={{
                                        marginBlock: 0,
                                        color: Colors.Text.subtle,
                                    }}
                                >
                                    Paying...
                                </p>
                            ) : (
                                <ButtonPrimary
                                    type={"Sized"}
                                    label={"Pay Debt"}
                                    border={"None"}
                                    scheme={"Inverse"}
                                    isLoading={isLoading}
                                    clickCB={handlePayDebtClick}
                                />
                            ))}
                    </div>
                </div>
                <div
                    css={{
                        inlineSize: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        paddingBlock,
                        paddingInline,
                        borderColor: "transparent",
                        borderBlockEndColor: Colors.Border.subtle,
                        borderRadius: "1px",
                        borderStyle: "solid",
                        borderWidth: "1px",

                        "& button": {
                            marginBlockStart:
                                layout === "full" ? "-10px" : "-2px",
                        },
                    }}
                >
                    <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                        Pack: {packName} ({player.packSpace} lbs)
                    </p>

                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "5px",
                            textTransform: "capitalize",
                        }}
                    >
                        Cuts: {packListstring.length ? packListstring : "None"}
                    </p>

                    <p css={{ marginBlockStart: 0, marginBlockEnd: "5px" }}>
                        Weapon:{" "}
                        {player.weapon
                            ? `${
                                  WeaponDetails[player.weapon as WeaponName]
                                      .name
                              } (${
                                  WeaponDetails[player.weapon as WeaponName]
                                      .damage
                              } damage)`
                            : "Unarmed"}
                    </p>
                </div>

                <div
                    css={{
                        paddingBlock,
                        paddingInline,
                    }}
                >
                    <h4
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "15px",
                            fontVariantCaps: "small-caps",
                            textTransform: "capitalize",
                        }}
                    >
                        {station?.name}
                    </h4>

                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "5px",
                        }}
                    >
                        Gang: {station?.gangName}
                    </p>

                    <p
                        css={{
                            marginBlockStart: 0,
                            marginBlockEnd: "5px",
                        }}
                    >
                        Street Rep: None
                    </p>
                    <small css={{ marginBlock: 0, color: Colors.Text.subtle }}>
                        Flying under the radar. You won&apos;t get hassled by
                        the local gang.
                    </small>
                </div>
            </div>

            {isModalOpen && <EndGameModal onCloseModal={handleCancelEndGame} />}
        </Fragment>
    );
};
