describe("Create Account", () => {
    it("should see create account page", () => {
        cy.visit("/create-account").title().should("eq", "Create Account | Uber Eats");
    });

    it("can see email and password validation errors", () => {
        cy.visit("/create-account");
        cy.get("input[name=email]").type("test");
        cy.get("span[role=alert]").should("have.text", "Please enter a valid email");
        cy.get("input[name=email]").clear();
        cy.get("span[role=alert]").should("have.text", "Email is required");
        cy.get("input[name=email]").type("test@email.com");
        cy.get("input[name=password]").type("test");
        cy.get("span[role=alert]").should("have.text", "Password must be longer than 8 characters");
        cy.get("input[name=password").clear();
        cy.get("span[role=alert]").should("have.text", "Password is required");
    });

    it("should be able to create account and login", () => {
        cy.intercept("http://localhost:4000/graphql", req => {
            /* Create a New Account When It Doesn't Exist */
            /* Not Create a New Account But Return True When It Already Exists */
            const { operationName } = req.body;
            if (operationName && operationName === "CreateAccount") {
                req.reply(res => {
                    res.send({
                        data: {
                            createAccount: {
                                GraphQLSucceed: true,
                                GraphQLError: null,
                                __typename: "CreateAccountOutput"
                            }
                        }
                    })
                })
            }
        });
        cy.visit("/create-account");
        cy.get("input[name=email]").type("test@email.com");
        cy.get("input[name=password]").type("test1234");
        cy.get("button[role=button]").click();
        cy.wait(1000);
        cy.login("test@email.com", "test1234");
        /* Replaced by Custom Commands */
        /* cy.title().should("eq", "Login | Uber Eats");
        cy.get("input[name=email]").type("test@email.com");
        cy.get("input[name=password]").type("test1234");
        cy.get("button[role=button]").click();
        cy.window().its("localStorage.LOCALSTORAGE_LOGIN_TOKEN").should("be.a", "string"); */
    });
});
