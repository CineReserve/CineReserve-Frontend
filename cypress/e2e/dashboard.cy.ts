describe("Dashboard Page Rendering", () => {
  beforeEach(() => {
    cy.visit("/dashboard", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });
  });

  it("shows KPI cards", () => {
    cy.contains("Total Theaters").should("exist");
    cy.contains("Auditoriums").should("exist");
    cy.contains("Total Seats").should("exist");
    cy.contains("Active Shows").should("exist");
  });

  it("shows Quick Actions", () => {
    cy.contains("Quick Actions").should("be.visible");
    cy.contains("Theaters").should("be.visible");
    cy.contains("Manage Staff").should("be.visible");
  });
});
