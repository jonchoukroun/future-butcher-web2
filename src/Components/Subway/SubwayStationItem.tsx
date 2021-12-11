/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { Station } from "../../Fixtures/subwayStations";
import { useGameState } from "../../GameData/GameStateProvider";
import { formatMoney } from "../Utils/formatMoney";
import * as Colors from "../../Styles/colors";

interface SubwayStationItemProps {
    station: Station;
}

export const SubwayStationItem = ({ station }: SubwayStationItemProps) => {
    const {
        state: { stateData },
    } = useGameState();
    const isCurrentStation =
        stateData && stateData.station.stationName === station.key;
    const canAfford = stateData && stateData.player.funds >= station.gangTax;
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
                    isCurrentStation
                        ? `${station.name} - (Here)`
                        : `${station.name} - ${formatMoney(station.gangTax)}`
                }
                border={"Thin"}
                isDisabled={isCurrentStation}
                clickCB={() => {
                    return;
                }}
            />
        </li>
    );
};
