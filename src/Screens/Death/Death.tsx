/** @jsx jsx */
import { jsx } from "@emotion/react";

import { WelcomeScreen } from "../Welcome/Welcome";
import { ScreenTemplate } from "../../Components";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";
import { useChannel } from "../../PhoenixChannel/ChannelProvider";

export function Death() {
    const {
        dispatch,
        state: { player },
    } = useGameState();
    if (player === undefined) throw new Error("State is undefined");

    const { handleInitGame } = useChannel();

    const handleStartOverClick = async () => {
        if ((await handleInitGame()) !== "ok") {
            dispatch({ type: "changeScreen", screen: Screen.Error });
        } else {
            dispatch({
                type: "changeScreen",
                screen: Screen.Welcome,
                screenProps: WelcomeScreen.StartOver,
            });
        }
    };

    return (
        <ScreenTemplate
            title={"You're dead!"}
            subtitle={"Game over"}
            content={[
                "These streets are too rough for a softy like you.",
                "The fight didn't go your way, and now you're laying dead in the gutter.",
                "Hungry scavengers pull their rusty blades and swarm your body.",
                "...if only you'd had better protection.",
            ]}
            primaryButtonLabel={"Try Again"}
            primaryClickCB={handleStartOverClick}
            primaryIsLoading={false}
        />
    );
}
