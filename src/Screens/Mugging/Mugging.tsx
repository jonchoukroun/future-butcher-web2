/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef, useState } from "react";

import { MuggingBribe } from "./MuggingBribe";
import { MuggingDefeat } from "./MuggingDefeat";
import { MuggingVictory } from "./MuggingVictory";
import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { isApiError } from "../../GameData/State";
import { handleMessage, MessageLevel } from "../../Logging/handleMessage";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

export const Mugging = () => {
    const {
        dispatch,
        state: { muggers, player, turnsLeft },
    } = useGameState();

    if (player === undefined || turnsLeft === undefined) {
        throw new Error("State is undefined");
    }

    if (muggers === undefined) {
        handleMessage("Muggers is undefined", MessageLevel.Error);
    }

    const { handlePushCallback } = useChannel();

    const { cash, health, pack, weapon } = player;

    const canBribeMugger =
        cash > 500 || Object.values(pack).find((cut) => cut > 0);

    const initialcashRef = useRef(cash);
    const initialPackRef = useRef(pack);
    const initialHealthRef = useRef(health);
    const initialTurnsLeftRef = useRef(turnsLeft);
    const currentMuggerRef = useRef(
        muggers === undefined ? "Fred Savage" : muggers[0],
    );
    const [muggingState, setMuggingState] = useState<
        "victory" | "defeat" | "bribe"
    >();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (action: "bribeMugger" | "fightMugger") => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback(action, {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "updateStateData", stateData: response });
        if (response.rules.state === "game_over") {
            dispatch({ type: "changeScreen", screen: Screen.Death });
            return null;
        }

        const outcome =
            action === "bribeMugger"
                ? "bribe"
                : initialTurnsLeftRef.current > response.rules.turns_left
                ? "defeat"
                : "victory";

        // If the mugger is defeated, remove him from the list
        if (outcome === "victory") {
            dispatch({ type: "killMugger" });
        } else {
            dispatch({ type: "shuffleMuggers" });
        }
        setMuggingState(outcome);
        setIsLoading(false);
    };

    if (muggingState === "defeat") {
        return (
            <MuggingDefeat
                initialHealth={initialHealthRef.current}
                initialTurnsLeft={initialTurnsLeftRef.current}
            />
        );
    }

    if (muggingState === "victory") {
        return (
            <MuggingVictory
                initialHealth={initialHealthRef.current}
                initialPack={initialPackRef.current}
            />
        );
    }

    if (muggingState === "bribe") {
        return (
            <MuggingBribe
                initialcash={initialcashRef.current}
                initialPack={initialPackRef.current}
            />
        );
    }

    const muggingContent = [
        `One of the city's relentless muggers, ${currentMuggerRef.current}, follows you from the subway.`,
        "Pulling a well-used blade, they charge you! You have a split second to react.",
    ];
    if (!player.weapon) {
        muggingContent.push("...a weapon may have come in handy here...");
    }

    const buttonLabel =
        weapon === null ? "Run for your life" : "Fight the mugger";

    return (
        <ScreenTemplate
            title={"A Mugger Attacks!"}
            content={muggingContent}
            danger={true}
            primaryButtonLabel={buttonLabel}
            primaryIsLoading={isLoading}
            primaryClickCB={() => handleClick("fightMugger")}
            secondaryButtonLabel={canBribeMugger ? "Offer a bribe" : undefined}
            secondaryClickCB={() => handleClick("bribeMugger")}
        />
    );
};
