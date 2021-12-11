/** @jsx jsx */
import { jsx } from "@emotion/react";

import { ButtonPrimary } from "../Form/ButtonPrimary";
import { subwayStations } from "../../Fixtures/subwayStations";
import { Screen, useGameState } from "../../GameData/GameStateProvider";
import * as Colors from "../../Styles/colors";

export const MainScreen = () => {
    const {
        state: { currentStation },
        dispatch,
    } = useGameState();
    const station = subwayStations.find((s) => s.key === currentStation);
    if (station === undefined) throw new Error("Station not found");

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                "& li": {
                    inlineSize: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockEnd: "20px",
                },
            }}
        >
            <h2
                css={{
                    marginBlockStart: "5px",
                    marginBlockEnd: "20px",
                    color: Colors.Text.heading,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordSpacing: "4px",
                    textAlign: "center",
                }}
            >
                {station.name}
            </h2>
            <ul
                css={{
                    inlineSize: "100%",
                    marginBlockStart: "32px",
                    paddingInlineStart: 0,
                }}
            >
                <li>
                    <ButtonPrimary
                        type={"Stretch"}
                        label={Screen.Market}
                        clickCB={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.Market,
                            })
                        }
                    />
                </li>
                <li>
                    <ButtonPrimary
                        type={"Stretch"}
                        label={station.uniqueBuilding}
                        clickCB={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.Main,
                            })
                        }
                    />
                </li>
                <li>
                    <ButtonPrimary
                        type={"Stretch"}
                        label={"Gang Hideout"}
                        clickCB={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.Main,
                            })
                        }
                    />
                </li>
                <li>
                    <ButtonPrimary
                        type={"Stretch"}
                        label={Screen.Subway}
                        clickCB={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.Subway,
                            })
                        }
                    />
                </li>
            </ul>
        </div>
    );
};
