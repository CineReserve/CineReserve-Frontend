describe("Login System – Deployment Critical Tests", () => {

  it("blocks login with incorrect password", () => {
    cy.visit("/login");

    cy.get('input[placeholder="owner@northstar.fi"]').type("owner@northstar.fi");
    cy.get('input[type="password"]').type("WRONGPASS");
    cy.contains("Sign In").click();

    cy.contains("Invalid password. Please try again.")
      .should("be.visible");
  });

  it("blocks login for non-existing user", () => {
    cy.visit("/login");

    cy.get('input[placeholder="owner@northstar.fi"]').type("ghost@user.fi");
    cy.get('input[type="password"]').type("abc123");
    cy.contains("Sign In").click();

    cy.contains("User not found. Please register first.")
      .should("be.visible");
  });

  it("allows valid login and redirects correctly", () => {
    cy.visit("/login");

    cy.get('input[placeholder="owner@northstar.fi"]').type("owner@northstar.fi");
    cy.get('input[type="password"]').type("password123");
    cy.contains("Sign In").click();

    cy.url().should("include", "/dashboard");

    // assert dashboard actually loaded
    cy.get("body").should("be.visible");
  });

});
