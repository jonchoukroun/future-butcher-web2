/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";

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
        state: { clinicCost, player },
    } = useGameState();
    if (clinicCost === undefined || player === undefined) {
        throw new Error("State is undefined");
    }

    const { handlePushCallback } = useChannel();

    const { pushAlert } = useAlertService();

    const [isLoading, setIsLoading] = useState(false);

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
            text: "You're back to full health and ready to keep hustling",
            isPersistent: false,
        });
        dispatch({ type: "changeScreen", screen: Screen.Subway });
    };

    const { cash, health } = player;

    const content = [
        "Welcome to the Free Mind and Body Restoration Clinic. Let the wondrous Earth Mother heal all your ailments.",
        `Full mind and body restoration costs ${formatMoney(
            clinicCost,
        )} and takes an hour.`,
    ];
    if (health === 100) {
        content.push(
            "Your chakras are perfectly aligned, there's nothing more we can do for you.",
        );
    } else if (cash < clinicCost) {
        content.push(
            '"Free" Clinic refers to our open minds, not our prices. Come back when you can afford treatment.',
        );
    } else {
        content.push(
            `Yikes! You look like you're running at about ${health}% of your soul's full potential.`,
            "Do you consent to treatment?",
        );
    }

    return (
        <ScreenTemplate
            title={"Free Clinic"}
            content={content}
            primaryButtonLabel={"Restore your health"}
            primaryIsDisabled={health === 100 || cash < clinicCost}
            primaryClickCB={handleHealClick}
            primaryIsLoading={false}
        />
    );
}
