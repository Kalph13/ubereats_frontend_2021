import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, waitFor, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "../../pages/login";
import { LoginDocument } from "../../graphql/generated";

describe("<Login />", () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;

    beforeEach(async () => {
        await waitFor(async () => {
            mockedClient = createMockClient();
            renderResult = render(
                <HelmetProvider>
                    <Router>
                        <ApolloProvider client={mockedClient}>
                            <Login />
                        </ApolloProvider>
                    </Router>
                </HelmetProvider>
            );
        });
    });

    it("should render well", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Uber Eats");
        });
    });

    it("displays email validation errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        await waitFor(() => {
            userEvent.type(email, "wrongEmail");
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
        await waitFor(() => {
            userEvent.clear(email);
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/email is required/i);
    });

    it("displays password required error", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const button = getByRole("button");
        await waitFor(() => {
            userEvent.type(email, "test@email.com");
            userEvent.click(button);
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);
    });

    it("submits form and calls mutation", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        const formData = {
            email: "test@email.com",
            password: "testPassword"
        };
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: {
                    GraphQLSucceed: true,
                    GraphQLError: "testLoginError",
                    loginToken: "testLoginToken"
                }
            }
        });
        mockedClient.setRequestHandler(LoginDocument, mockedMutationResponse);
        jest.spyOn(Storage.prototype, "setItem");
        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(button);
        });
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password
            }
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/testLoginError/i);
        expect(localStorage.setItem).toHaveBeenCalledWith("LOCALSTORAGE_LOGIN_TOKEN", "testLoginToken");
    })
});
