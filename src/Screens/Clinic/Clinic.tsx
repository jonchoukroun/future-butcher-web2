/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useState } from "react";

import { useAlertService } from "../../AlertService/AlertServiceProvider";
import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";
import { formatMoney } from "../../Utils/formatMoney";

export function Clinic() {
    const {
        dispatch,
        state: { clinicPrice, oilPrice, player },
    } = useGameState();
    if (
        clinicPrice === undefined ||
        oilPrice === undefined ||
        player === undefined
    ) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();

    const { pushAlert } = useAlertService();

    const [isLoading, setIsLoading] = useState(false);

    const { cash, hasOil, health, weapon } = player;

    const handleHealClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const stateData = await handlePushCallback("restoreHealth", {});

        setIsLoading(false);

        if (stateData === undefined || isApiError(stateData)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        dispatch({ type: "updateStateData", stateData });
        pushAlert({
            text: "You're back to full health and ready to keep hustling.",
            isPersistent: false,
        });
        dispatch({ type: "changeScreen", screen: Screen.Subway });
    };

    const handleBuyOilClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const stateData = await handlePushCallback("buyOil", {});

        setIsLoading(false);

        if (stateData === undefined || isApiError(stateData)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }

        dispatch({ type: "updateStateData", stateData });
        pushAlert({
            text: "You scored some Adrenal Gland Essential Oil! Outrun any attacker, guaranteed. But it's only good for 1 fight.",
            isPersistent: false,
        });
        dispatch({ type: "changeScreen", screen: Screen.Subway });
    };

    const content = [
        "Welcome to the Free Mind and Body Restoration Clinic. Let the wondrous Earth Mother heal all your ailments.",
    ];
    if (health === 100) {
        content.push(
            "Your chakras are perfectly aligned, there's nothing more we can do for you.",
        );
    } else if (cash < clinicPrice) {
        content.push(
            `"Free" Clinic refers to our open minds, not our prices. Come back when you have ${formatMoney(
                clinicPrice,
            )}.`,
        );
    } else {
        content.push(
            `Full mind and body restoration costs ${formatMoney(
                clinicPrice,
            )} and takes an hour.`,
        );
    }

    if (!hasOil && weapon === null && cash >= oilPrice) {
        content.push(
            `You're in luck! We have Adrenal Gland Essential Oils fresh from an unlucky patient. Only ${formatMoney(
                oilPrice,
            )} and you'll run faster than anything, guaranteed!`,
        );
    }
    if (!hasOil && weapon === null && cash < oilPrice) {
        content.push(
            "Too bad you can't afford our patented Adrenal Gland Essential Oils. It's fresh from a recent patient and will let you outrun anything.",
        );
    }

    const buyOilButtonLabel =
        weapon === null ? "Buy Essential Oils" : "Out of Essential Oils";

    return (
        <Fragment>
            {!hasOil && weapon === null ? (
                <ScreenTemplate
                    title={"Free Clinic"}
                    content={content}
                    primaryButtonLabel={"Restore your health"}
                    primaryIsDisabled={health === 100 || cash < clinicPrice}
                    primaryClickCB={handleHealClick}
                    primaryIsLoading={false}
                    secondaryButtonLabel={buyOilButtonLabel}
                    secondaryClickCB={handleBuyOilClick}
                    secondaryIsDisabled={weapon != null || cash < oilPrice}
                    secondaryIsLoading={isLoading}
                />
            ) : (
                <ScreenTemplate
                    title={"Free Clinic"}
                    content={content}
                    primaryButtonLabel={"Restore your health"}
                    primaryIsDisabled={health === 100 || cash < clinicPrice}
                    primaryClickCB={handleHealClick}
                    primaryIsLoading={false}
                />
            )}
        </Fragment>
    );
}
