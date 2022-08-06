import React from "react";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import { NotFound } from "../../pages/404";

describe("<NotFound />", () => {
    it("renders well with 404 error", async () => {
        render(
            <HelmetProvider>
                <Router>
                    <NotFound />
                </Router>
            </HelmetProvider>
        );
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Uber Eats");
        });
    });
});
