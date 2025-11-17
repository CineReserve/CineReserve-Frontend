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

Cypress.Commands.add("loginAsOwner", () => {
  cy.request("POST", "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net/login", {
    email: "owner@northstar.fi",
    password: "password123"
  }).then((res) => {
    const token = res.body.token;
    const role = "owner";

    // Set React state by modifying the app window
    cy.window().then((win: any) => {
      win.__appSetToken(token);
      win.__appSetRole(role);
    });
  });
});
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsOwner(): Chainable<void>;
    }
  }
}