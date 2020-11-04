import * as React from "react";

import { render } from "@testing-library/react";
import { Market } from "./market";
import { MARKET_CUTS } from "../../Fixtures/marketCuts";

describe("Market component", function () {
    const subwaySelectorStub = () => {
        return;
    };

    it("renders an entry for each cut", function () {
        const { getByText } = render(
            <Market subwaySelector={subwaySelectorStub} />,
        );
        MARKET_CUTS.map((cut) => {
            expect(getByText(cut.name)).toBeInTheDocument();
        });
    });
});
