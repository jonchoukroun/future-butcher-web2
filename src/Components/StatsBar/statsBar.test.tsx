import * as React from "react";

import { render, fireEvent } from "@testing-library/react";
import { StatsBar } from "./statsBar";

describe("Stats bar component", function () {
    const sharedRender = <StatsBar />;

    const cashStatRegex = /^\$\d+\s?\w?$/;
    const cashDetailRegex = /^bank balance/i;
    const debtStatRegex = /^-\$\d+\s?\w?$/;
    const debtDetailRegex = /^current debt/i;
    const turnsStatRegex = /^\d+$/;
    const turnsDetailRegex = /[you have]\s\d+[turns left]/i;

    it("renders the cash stat but not the detail", function () {
        const { getByRole, queryByText } = render(sharedRender);
        expect(
            getByRole("button", { name: cashStatRegex }),
        ).toBeInTheDocument();
        expect(queryByText(cashDetailRegex)).not.toBeInTheDocument();
    });
    it("renders the debt stat but not the detail", function () {
        const { getByRole, queryByText } = render(sharedRender);
        expect(
            getByRole("button", { name: debtStatRegex }),
        ).toBeInTheDocument();
        expect(queryByText(debtDetailRegex)).not.toBeInTheDocument();
    });

    it("renders the turns stat but not the detail", function () {
        const { getByRole, queryByText } = render(sharedRender);
        expect(getByRole("button", { name: turnsStatRegex }));
        expect(queryByText(turnsDetailRegex)).not.toBeInTheDocument();
    });

    it("renders the settings button", function () {
        const { getByTitle } = render(sharedRender);
        expect(getByTitle("settings-icon")).toBeInTheDocument();
    });

    it("opens the cash stat when clicking the cash stat button", function () {
        const { getByRole, getByText } = render(sharedRender);
        fireEvent.click(getByRole("button", { name: cashStatRegex }));
        expect(getByText(cashDetailRegex)).toBeInTheDocument();
    });

    it("opens the debt stat when clicking the debt stat button", function () {
        const { getByRole, getByText } = render(sharedRender);
        fireEvent.click(getByRole("button", { name: debtStatRegex }));
        expect(getByText(debtDetailRegex)).toBeInTheDocument();
    });

    it("opens the turns stat when clicking the turns stat button", function () {
        const { getByRole, getByText } = render(sharedRender);
        fireEvent.click(getByRole("button", { name: turnsStatRegex }));
        expect(getByText(turnsDetailRegex)).toBeInTheDocument();
    });
});
