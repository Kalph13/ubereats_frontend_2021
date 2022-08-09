/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@testing-library/cypress' /* This Doesn't Work for Unknown Reason */

Cypress.Commands.add("assertLoggedIn", () => {
    cy.window().its("localStorage.LOCALSTORAGE_LOGIN_TOKEN").should("be.a", "string");
});

Cypress.Commands.add("assertLoggedOut", () => {
    cy.window().its("localStorage.LOCALSTORAGE_LOGIN_TOKEN").should("be.undefined");
});

Cypress.Commands.add("login", (email, password) => {
    cy.visit("/");
    cy.assertLoggedOut();
    cy.title().should("eq", "Login | Uber Eats");
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("button[role=button]").should("not.have.class", "pointer-events-none").click();
    cy.assertLoggedIn();
})

/* TypeScript for Cypress Custom Commands: https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense */
declare global {
    namespace Cypress {
        interface Chainable {
            assertLoggedIn(): Chainable<void>
            assertLoggedOut(): Chainable<void>
            login(email: string, password: string): Chainable<void>
        }
    }
}
