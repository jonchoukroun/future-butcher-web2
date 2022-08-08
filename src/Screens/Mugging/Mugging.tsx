/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useRef, useState } from "react";

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

    const { pack } = player;

    const initialTurnsLeft = useRef(turnsLeft);
    const initialPack = useRef(pack);
    const currentMuggerRef = useRef(
        muggers === undefined ? "Fred Savage" : muggers[0],
    );
    const [muggingState, setMuggingState] = useState<"victory" | "defeat">();
    const [isLoading, setIsLoading] = useState(false);

    const handleFightMuggerClick = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const response = await handlePushCallback("fightMugger", {});
        // TODO: API error handling
        if (response === undefined || isApiError(response)) {
            dispatch({ type: "changeScreen", screen: Screen.Error });
            return;
        }
        dispatch({ type: "updateStateData", stateData: response });
        const outcome =
            initialTurnsLeft.current > response.rules.turns_left
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
        return <MuggingDefeat initialTurnsLeft={initialTurnsLeft.current} />;
    }

    if (muggingState === "victory") {
        return <MuggingVictory initialPack={initialPack.current} />;
    }

    const muggingContent = [
        `One of the city's relentless muggers, ${currentMuggerRef.current}, follows you from the subway.`,
        "Pulling a well-used blade, they charge you!",
        "You have a split second to react...",
    ];
    if (!player.weapon)
        muggingContent.push("...a weapon may have come in handy here...");

    return (
        <ScreenTemplate
            title={"A Mugger Attacks!"}
            content={muggingContent}
            danger={true}
            buttonLabel={"Fight the mugger!"}
            isLoading={isLoading}
            clickCB={handleFightMuggerClick}
        />
    );
};
