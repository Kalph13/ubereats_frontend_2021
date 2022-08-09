import React from "react";
import { render, waitFor, RenderResult } from "../../test-utils";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount } from "../../pages/create-account";
import userEvent from "@testing-library/user-event";
import { UserRole, CreateAccountDocument } from "../../graphql/generated"

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
    const realModule = jest.requireActual("react-router-dom");
    return {
        ...realModule,
        useNavigate: () => mockPush
    };
});

describe("<CreateAccount />", () => {
    let mockedClient: MockApolloClient;
    let renderResult: RenderResult;

    beforeEach(async () => {
        await waitFor(() => {
            mockedClient = createMockClient();
            renderResult = render(
                <ApolloProvider client={mockedClient}>
                    <CreateAccount />
                </ApolloProvider>
            );
        });
    });

    it("renders well", async () => {
        await waitFor(() => 
            expect(document.title).toBe("Create Account | Uber Eats")
        );
    });

    it("renders email and password errors", async () => {
        const { getByPlaceholderText, getByTestId } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        await userEvent.type(email, "test");
        const emailFormatError = await waitFor(() => getByTestId("email_invalid"));
        expect(emailFormatError).toHaveTextContent(/please enter a valid email/i);
        await userEvent.clear(email);
        const emailEmptyError = await waitFor(() => getByTestId("email_required"));
        expect(emailEmptyError).toHaveTextContent(/email is required/i);
        await userEvent.type(email, "test@email.com");
        await userEvent.type(password, "test");
        const passwordFormatError = await waitFor(() => getByTestId("password_invalid"));
        expect(passwordFormatError).toHaveTextContent(/password must be longer than 8 characters/i);
        await userEvent.clear(password);
        const passwordEmptyError = await waitFor(() => getByTestId("password_required"));
        expect(passwordEmptyError).toHaveTextContent(/password is required/i);
    });

    it("submits form and calls mutation", async () => {
        const { getByRole, getByPlaceholderText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const button = getByRole("button");
        const formData = {
            email: "test@email.com",
            password: "testPassword",
            role: UserRole.Client
        };
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    GraphQLSucceed: true,
                    GraphQLError: "testCreateAccountError",
                }
            }
        });
        mockedClient.setRequestHandler(CreateAccountDocument, mockedMutationResponse);
        jest.spyOn(window, "alert").mockImplementation(() => null);
        await userEvent.type(email, formData.email);
        await userEvent.type(password, formData.password);
        await userEvent.click(button);
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role
        }});
        expect(window.alert).toHaveBeenCalledWith("Your account is successfully created! Log in and enjoy Uber Eats");
        const errorMessage = await waitFor(() => getByRole("alert"));
        expect(mockPush).toHaveBeenCalledWith("/");
        expect(errorMessage).toHaveTextContent("testCreateAccountError");
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
