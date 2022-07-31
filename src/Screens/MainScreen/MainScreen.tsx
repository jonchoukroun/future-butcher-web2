/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../../Components/Window/WindowSizeProvider";
import { subwayStations } from "../../Fixtures/subwayStations";
import { Screen, ScreenType } from "../../GameData";
import { useGameState } from "../../GameData/GameStateProvider";

import * as Colors from "../../Styles/colors";

export const MainScreen = () => {
    const {
        state: { currentStation, turnsLeft },
        dispatch,
    } = useGameState();
    if (turnsLeft === undefined) throw new Error("State is undefined");

    const station = subwayStations.find((s) => s.key === currentStation);
    if (station === undefined) throw new Error("Station not found");

    const handleUniqueBuildingClick = () => {
        let screen: ScreenType;
        switch (currentStation) {
            case "bell_gardens":
                screen = Screen.Store;
                break;
            default:
                screen = Screen.Market;
                break;
        }
        dispatch({ type: "changeScreen", screen });
    };

    const { getContentSize, layout } = useWindowSize();
    const { blockSize } = getContentSize();
    const gridRowHeight = Math.round(blockSize / 3.5);

    return (
        <div
            css={{
                blockSize: "100%",
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                paddingInline: "10px",
            }}
        >
            <h2
                css={{
                    marginBlockStart: "20px",
                    marginBlockEnd: "10px",
                    color: Colors.Text.base,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    wordSpacing: "4px",
                    textAlign: "center",
                }}
            >
                {station.name}
            </h2>
            <div
                css={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: `${gridRowHeight}px ${gridRowHeight}px`,
                    columnGap: "20px",
                    rowGap: "20px",
                    marginBlockStart: "30px",

                    "& button": {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent:
                            layout === "full" ? "center" : "space-between",
                        paddingBlock: "25px",
                        backgroundColor: Colors.Background.inverse,
                        borderColor: Colors.Border.subtle,
                        borderRadius: "2px",
                        borderStyle: "outset",
                        borderWidth: "2px",
                        boxShadow: "2px 2px 8px 2px rgba(0, 0, 0, 0.4)",
                    },

                    "& svg": {
                        marginBlockEnd: "5px",
                        color: Colors.Text.inverse,
                        fontSize: "30px",
                    },

                    "& h3": {
                        marginBlock: 0,
                        color: "black",
                        fontVariantCaps: "small-caps",
                        textTransform: "capitalize",
                    },

                    "& button:disabled": {
                        backgroundColor: Colors.Background.base,
                        borderStyle: "solid",
                        borderWidth: "thin",
                        boxShadow: "none",
                    },

                    "& button:disabled h3": {
                        color: Colors.Text.disable,
                        fontStyle: "italic",
                    },

                    "& button:disabled svg": {
                        color: Colors.Text.disable,
                    },
                }}
            >
                <button
                    disabled={currentStation === "bell_gardens"}
                    onClick={() =>
                        dispatch({
                            type: "changeScreen",
                            screen: Screen.Market,
                        })
                    }
                >
                    <h3>Market</h3>
                </button>
                <button
                    disabled={
                        !(turnsLeft < 20 && currentStation === "bell_gardens")
                    }
                    onClick={handleUniqueBuildingClick}
                >
                    <h3>{station.uniqueBuilding}</h3>
                </button>
                <button disabled={true}>
                    <h3>Gang Hideout</h3>
                </button>
                {turnsLeft > 0 ? (
                    <button
                        onClick={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.Subway,
                            })
                        }
                    >
                        <h3>Subway</h3>
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            dispatch({
                                type: "changeScreen",
                                screen: Screen.EndGame,
                            })
                        }
                    >
                        <h3>Retire</h3>
                    </button>
                )}
            </div>

            <button
                css={{
                    marginBlockStart: "40px",
                    backgroundColor: "transparent",
                    border: "none",
                }}
                onClick={() => alert("Here's some help, sucka!")}
            >
                <p css={{ color: Colors.Text.subtle }}>Need help?</p>
            </button>
        </div>
    );
};
