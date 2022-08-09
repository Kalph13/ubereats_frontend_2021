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

    it("displays email errors", async () => {
        const { getByPlaceholderText, getByRole, getByTestId } = renderResult;
        const email = getByPlaceholderText(/email/i);
        await userEvent.type(email, "test"); /* Don't Need to Use waitFor() Here */
        const formatError = await waitFor(() => getByTestId("email_invalid")); /* Must Use waitFor() Here */
        expect(formatError).toHaveTextContent(/please enter a valid email/i); 
        await userEvent.clear(email); /* Don't Need to Use waitFor() Here */
        const emptyError = await waitFor(() => getByTestId("email_required")); /* Must Use waitFor() Here */
        expect(emptyError).toHaveTextContent(/email is required/i);
    });

    it("displays password errors", async () => {
        const { getByPlaceholderText, getByRole, getByTestId } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        await userEvent.type(email, "test@email.com");
        await userEvent.type(password, "test");
        const formatError = await waitFor(() => getByTestId("password_invalid"));
        expect(formatError).toHaveTextContent(/password must be longer than 8 characters/i);
        await userEvent.clear(password);
        const emptyError = await waitFor(() => getByTestId("password_required"));
        expect(emptyError).toHaveTextContent(/password is required/i);
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
        await userEvent.type(email, formData.email);
        await userEvent.type(password, formData.password);
        await userEvent.click(button);
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password
        }});
        const errorMessage = await waitFor(() => getByRole("alert"));
        expect(errorMessage).toHaveTextContent(/testLoginError/i);
        expect(localStorage.setItem).toHaveBeenCalledWith("LOCALSTORAGE_LOGIN_TOKEN", "testLoginToken");
    });
});
