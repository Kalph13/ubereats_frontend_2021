describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Uber Eats");
  });

  it("can see email and password validation errors", () => {
    cy.visit("/");
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
  
  it("can fill out the form and log in", () => {
    cy.login("test@email.com", "test1234");
    /* Replaced by Custom Commands */
    /* cy.visit("/");
    cy.get("input[name=email]").type("test@email.com");
    cy.get("input[name=password]").type("test1234");
    cy.get("button[role=button]").should("not.have.class", "pointer-events-none").click();
    cy.window().its("localStorage.LOCALSTORAGE_LOGIN_TOKEN").should("be.a", "string"); */
  });
});
