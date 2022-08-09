describe("Edit Profile", () => {
    beforeEach(() => {
        cy.login("test@email.com", "test1234");
    });

    it("can go to /edit-profile using the header", () => {
        cy.get('a[href="/edit-profile"]').click();
        cy.wait(2000);
        cy.title().should("eq", "Edit Profile | Uber Eats");
    });

    it("can change email", () => {
        cy.intercept("POST", "http://localhost:4000/graphql", req => {
            if (req.body?.operationName === "EditProfile") {
                console.log("------ Edit Profile (Cypress) ------ req.body:", req.body);
                req.body.variables.editProfileInput.email = "test@email.com";
            }
        });
        cy.visit("/edit-profile");
        cy.get("input[name=email]").clear().type("test-e2e@email.com");
        cy.get("button[role=button]").click();
    });
});
