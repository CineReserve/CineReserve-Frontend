describe("Navigation & Routing – Full System", () => {
  beforeEach(() => {
    cy.visit("/dashboard", {
      onBeforeLoad(win) {
        win.__cypressTesting = true; // bypass ProtectedRoute
      }
    });
  });

  it("Dashboard loads correctly", () => {
    cy.contains("Quick Actions").should("be.visible");
    cy.contains("Theaters").should("be.visible");
    cy.contains("Manage Staff").should("be.visible");
  });

  it("navigates to Theater Management", () => {
    cy.contains("Theaters").should("be.visible").click();
    cy.url().should("include", "/theaters");
    cy.contains("Theater Management").should("exist");
  });

  it("navigates to Auditoriums from Theater page", () => {
    cy.contains("Theaters").click();
    cy.get(".theater-row").first().within(() => {
      cy.get(".btn-view").click();  // 👁️ icon
    });
    cy.url().should("include", "/auditoriums");
    cy.contains("Auditorium").should("be.visible");
  });

  it("navigates back to Theaters", () => {
    cy.contains("Theaters").click();
    cy.get(".theater-row").first().within(() => cy.get(".btn-view").click());
    cy.contains("← Back to Theaters").click();
    cy.contains("Theater Management").should("exist");
  });
});
