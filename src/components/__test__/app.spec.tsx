import React from "react";
import { render, waitFor } from "@testing-library/react";
import { isLoggedInVar } from "../../apollo";
import { App } from "../App";

jest.mock("../../routers/logged-out-router", () => {
    return {
        LoggedOutRouter: () => <span>logged-out</span>
    }
});

jest.mock("../../routers/logged-in-router", () => {
    return {
        LoggedInRouter: () => <span>logged-in</span>
    }
});

describe("<App />", () => {
    it("renders LoggedOutRouter", () => {
        const { getByText } = render(<App />);
        getByText("logged-out");
    });
    
    it("renders LoggedInRouter", async () => {
        await waitFor(() => {
            isLoggedInVar(true);
        });
        const { getByText } = render(<App />);
        getByText("logged-in");
    });
});
