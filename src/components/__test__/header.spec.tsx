import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../header";
import { FindMeDocument } from "../../graphql/generated";

describe("<Header />", () => {
    it("renders verification banner", async () => {
        await waitFor(async () => {
            const { getByText } = render(
                <MockedProvider
                    mocks={[{
                        request: {
                            query: FindMeDocument
                        },
                        result: {
                            data: {
                                findMe: {
                                    id: 1,
                                    email: "",
                                    role: "",
                                    verified: false
                                }
                            }
                        }
                    }]}
                >
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 0));
            getByText("Please verify your email");
        });
    });

    it("renders without verification banner", async () => {
        await waitFor(async () => {
            const { queryByText } = render(
                <MockedProvider
                    mocks={[{
                        request: {
                            query: FindMeDocument
                        },
                        result: {
                            data: {
                                findMe: {
                                    id: 1,
                                    email: "",
                                    role: "",
                                    verified: true
                                }
                            }
                        }
                    }]}
                >
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            );
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(queryByText("Please verify your email")).toBeNull();
        });
    });
});
