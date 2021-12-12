/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { player } from "../../Fixtures/player";
import { Station } from "../../Fixtures/subwayStations";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../Utils/formatMoney";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    station: Station;
}

export const SubwayStationItem = ({ station }: SubwayStationItemProps) => {
    const {
        state: { currentStation },
    } = useGameState();

    const canAfford = player.cash >= station.gangTax;

    return (
        <li
            css={{
                inlineSize: "100%",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",

                "& button": {
                    fontSize: "16px",
                    color: canAfford ? Colors.Text.primary : Colors.Text.danger,
                },
            }}
        >
            <ButtonPrimary
                type={"Stretch"}
                label={
                    station.key === currentStation
                        ? `${station.name} - (Here)`
                        : `${station.name} - ${formatMoney(station.gangTax)}`
                }
                border={"Thin"}
                isDisabled={currentStation === station.key}
                clickCB={() => {
                    return;
                }}
            />
        </li>
    );
};
