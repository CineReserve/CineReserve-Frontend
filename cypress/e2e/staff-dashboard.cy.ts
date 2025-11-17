describe("Staff Dashboard Rendering", () => {
  beforeEach(() => {
    cy.visit("/staff-dashboard", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });
  });

  it("shows staff dashboard content", () => {
    cy.contains("Total Theaters").should("exist");
    cy.contains("Quick Actions").should("exist");
    cy.contains("Theaters").should("exist");
  });
});
