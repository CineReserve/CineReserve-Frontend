describe("Theater Management – Basic Rendering & Actions", () => {
  beforeEach(() => {
    cy.visit("/theaters", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;
      }
    });
  });

  it("renders theater list correctly", () => {
    cy.contains("Theater Management").should("exist");
    cy.get(".theater-row").should("have.length.at.least", 1);
  });

  it("filters by search", () => {
    cy.get(".search-input").type("Oulu");
    cy.get(".theater-row").each(row => {
      cy.wrap(row).should("contain.text", "Oulu");
    });
  });

  it("opens Add Theater modal", () => {
    cy.contains("Add Theater").click();
    cy.contains("Add New Theater").should("be.visible");
    cy.contains("Save").should("exist");
  });

  it("opens Edit modal for first theater", () => {
    cy.get(".theater-row").first().within(() => {
      cy.get(".btn-edit").click();
    });
    cy.contains("Edit Theater").should("exist");
  });

  it("opens View Auditoriums page", () => {
    cy.get(".theater-row").first().within(() => {
      cy.get(".btn-view").click();
    });
    cy.contains("Auditorium").should("exist");
  });
});
