describe("User Management Page", () => {

  beforeEach(() => {
    // 방문 #1 — enable bypass
    cy.visit("/", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });

    // 방문 #2 — go to /users WITH bypass
    cy.visit("/users", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });

    // Wait for UI + API data
    cy.contains("User Management", { timeout: 8000 }).should("be.visible");
    cy.get(".user-item", { timeout: 8000 }).should("exist");
  });

  it("loads the page", () => {
    cy.contains("User Management").should("be.visible");
  });

  it("shows at least one user in the list", () => {
    cy.get(".user-item").should("have.length.at.least", 1);
  });

  it("can create a new user", () => {
    cy.get(".btn-add").click();

    cy.get('input[placeholder="Full Name *"]').type("Cypress Test User");
    cy.get('input[placeholder="Email Address *"]').type("cypress_test_user@demo.com");
    cy.get('input[type="password"]').type("TestPass123");

    cy.contains("Save").click();

    cy.contains("cypress_test_user@demo.com", { timeout: 8000 }).should("exist");
  });

  it("can delete a user", () => {
    cy.get(".user-item")
      .contains("cypress_test_user@demo.com")
      .parents(".user-item")
      .find(".btn-delete")
      .click();

    cy.contains("cypress_test_user@demo.com").should("not.exist");
  });

  it("can edit an existing user", () => {
    cy.get(".user-item")
      .contains("staff1@northstar.fi")
      .parents(".user-item")
      .find(".btn-edit")
      .click();

    cy.get('input[placeholder="Full Name *"]')
      .clear()
      .type("Updated Staff Member");

    cy.contains("Save").click();

    cy.contains("Updated Staff Member").should("exist");
  });

});
