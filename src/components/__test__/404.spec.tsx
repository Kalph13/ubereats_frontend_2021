import React from "react";
import { render, waitFor } from "../../test-utils";
import { NotFound } from "../../pages/404";

/* Replaced by 'test-utils' */
/* import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom"; */

describe("<NotFound />", () => {
    it("renders well with 404 error", async () => {
        render(
            <NotFound />
            /* Replaced by 'test-utils */
            /* <HelmetProvider>
                <Router>
                    <NotFound />
                </Router>
            </HelmetProvider> */
        );
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Uber Eats");
        });
    });
});
