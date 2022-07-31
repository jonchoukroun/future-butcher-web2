/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ScreenTemplate } from "../../Components/ScreenTemplate";
import { Screen } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

export const ErrorScreen = () => {
    const { dispatch } = useGameState();

    const handleClick = () => {
        const playerName = localStorage.getItem("playerName");
        const playerHash = localStorage.getItem("playerHash");

        dispatch({
            type: "changeScreen",
            screen: !playerName || !playerHash ? Screen.Login : Screen.Welcome,
        });
    };

    return (
        <ScreenTemplate
            title={"Lockdown in LA!"}
            content={[
                "A killer Belgian virus is burning across the globe. The meat economy is at a standstill while people shelter in place.",
            ]}
            buttonLabel={"Try Again"}
            isLoading={false}
            clickCB={handleClick}
        />
    );
};
