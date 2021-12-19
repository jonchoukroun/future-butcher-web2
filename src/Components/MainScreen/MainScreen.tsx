/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDungeon,
    faHandshake,
    faHotel,
    faRoute,
} from "@fortawesome/free-solid-svg-icons";

import { useWindowSize } from "../Window/WindowSizeProvider";
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
                        backgroundColor: "transparent",
                        borderColor: Colors.Border.subtle,
                        borderRadius: "2px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                    },

                    "& svg": {
                        marginBlockEnd: "5px",
                        color: Colors.Text.accent,
                        fontSize: "30px",
                    },

                    "& h3": {
                        marginBlock: 0,
                        color: Colors.Text.base,
                    },
                }}
            >
                <button
                    onClick={() =>
                        dispatch({
                            type: "changeScreen",
                            screen: Screen.Market,
                        })
                    }
                >
                    <FontAwesomeIcon icon={faHandshake} size={"lg"} />
                    <h3>Market</h3>
                </button>
                <button>
                    <FontAwesomeIcon icon={faHotel} size={"lg"} />
                    <h3>{station.uniqueBuilding}</h3>
                </button>
                <button>
                    <FontAwesomeIcon icon={faDungeon} size={"lg"} />
                    <h3>Gang Hideout</h3>
                </button>
                <button
                    onClick={() =>
                        dispatch({
                            type: "changeScreen",
                            screen: Screen.Subway,
                        })
                    }
                >
                    <FontAwesomeIcon icon={faRoute} size={"lg"} />
                    <h3>Subway</h3>
                </button>
            </div>

            <button
                css={{
                    marginBlockStart: "40px",
                    backgroundColor: "transparent",
                    border: "none",
                }}
                onClick={() => alert("Here's some help, sucka!")}
            >
                <small>Need help?</small>
            </button>
        </div>
    );
};
