import * as React from "react";

import { render } from "@testing-library/react";
import { Subway } from "./subway";
import { SUBWAY_STATIONS } from "../../Fixtures/subwayStations";

describe("Subway component", function () {
    const marketSelectorStub = () => {
        return;
    };

    it("renders an entry for each cut", function () {
        const { getByText } = render(
            <Subway marketSelector={marketSelectorStub} />,
        );
        SUBWAY_STATIONS.map((station) => {
            expect(getByText(station.name)).toBeInTheDocument();
        });
    });
});
