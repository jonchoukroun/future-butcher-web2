/** @jsx jsx */
import { jsx } from "@emotion/react";

import { useWindowSize } from "../Window/WindowSizeProvider";
import { ButtonPrimary } from "../Form";
import { formatMoney } from "../Utils/formatMoney";
import { player } from "../../Fixtures/player";

export const Welcome = () => {
    const { getContentSize, layout } = useWindowSize();
    const { blockSize, inlineSize } = getContentSize();

    const date = new Date();
    date.setFullYear(2055, date.getMonth(), date.getDate());
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const displayDate = date.toLocaleDateString("en-US", options);

    const handleStartClick = () => {
        console.log("!!push start game");
        console.log("!!dispatch incrementProcess");
        console.log("!!dispatch changeScreen: main");
    };

    return (
        <div
            css={{
                blockSize: `${blockSize}px`,
                inlineSize: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlock: "20px",
                }}
            >
                <h2
                    css={{
                        marginBlockStart: 0,
                        marginBlockEnd: "5px",
                        fontVariantCaps: "small-caps",
                    }}
                >
                    Los Angeles
                </h2>
                <h4 css={{ marginBlock: 0, fontFamily: "Share Tech Mono" }}>
                    {displayDate}
                </h4>
            </div>

            <div
                css={{
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBlockStart: layout === "full" ? "40px" : 0,
                    paddingInline: "5px",
                    p: {
                        marginBlockEnd: layout === "full" ? "16px" : 0,
                    },
                }}
            >
                <p>
                    The economy is ruins after the collapse of HypeCoin. The
                    rich and famous are nuts for the latest fad -{" "}
                    <em>fresh, human meat</em>.
                </p>

                <p>
                    Two-bit hustlers like you have only one option: get rich off
                    this new addiction, or become the product.
                </p>

                <p>
                    Travel the city&apos;s neighborhoods and seize opportunity.
                    But watch your back! Gangs run the city, and you don&apos;t
                    want to cross them.
                </p>

                <p>
                    You have 24 hours and a {formatMoney(player.debt)} loan.
                    Hurry up, it&apos;s got a 5% hourly interest rate. Welcome
                    to the People&apos;s Republic of Los Angeles.
                </p>
            </div>

            <div
                css={{
                    position: layout === "compact" ? "absolute" : "relative",
                    bottom: 0,
                    blockSize: "70px",
                    inlineSize: `${inlineSize}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBlockStart: layout === "full" ? "40px" : 0,
                }}
            >
                <ButtonPrimary
                    label={"Start Game"}
                    type={"Stretch"}
                    clickCB={handleStartClick}
                />
            </div>
        </div>
    );
};
