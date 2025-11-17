describe("Auditorium Management – Basic Rendering", () => {
  beforeEach(() => {
    cy.visit("/theaters", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });

    // Click first theater's view button
    cy.get(".theater-row").first().within(() => {
      cy.get(".btn-view").click();
    });
  });

  it("renders auditorium page correctly", () => {
    cy.contains("Auditorium").should("be.visible");
    cy.get(".auditorium-row").should("have.length.at.least", 1);
  });

  it("opens Add Auditorium modal", () => {
    cy.contains("Add Auditorium").click();
    cy.contains("Add New Auditorium").should("exist");
  });

  it("opens Edit Auditorium modal", () => {
    cy.get(".auditorium-row").first().within(() => {
      cy.get(".btn-edit").click();
    });
    cy.contains("Edit Auditorium").should("exist");
  });

  it("opens seat layout viewer", () => {
    cy.get(".auditorium-row").first().within(() => {
      cy.get(".btn-view").click();
    });
    cy.contains("Seat Layout").should("exist");
  });

  it("returns back to Theaters page", () => {
    cy.contains("← Back to Theaters").click();
    cy.contains("Theater Management").should("exist");
  });
});
