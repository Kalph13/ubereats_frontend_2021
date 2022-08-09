describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/")
      .title()
      .should("eq", "Login | Uber Eats");
  });

  it("can fill out the form", () => {
    cy.visit("/")
      .get("input[name=email]")
      .type("test@email.com")
      .get("input[name=password]")
      .type("testPassword")
      .get("button[role=button]")
      .should("not.have.class", "pointer-events-none");
  });

  it("can see email and password validation errors", () => {
    cy.visit("/")
      .get("input[name=email]")
      .type("test")
      .get("span[role=alert]")
      .should("have.text", "Please enter a valid email")
  });
});
