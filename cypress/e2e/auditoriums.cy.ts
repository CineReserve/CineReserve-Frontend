describe("Auditorium Management – Real Backend", () => {

  beforeEach(() => {
    // Step 1 – Visit page
    cy.intercept("GET", "**/api/cities").as("loadCities");
    cy.intercept("GET", "**/api/theaters").as("loadTheaters");

    cy.visit("/theaters");

    // Step 2 – Wait for backend calls
    cy.wait("@loadCities", { timeout: 20000 });
    cy.wait("@loadTheaters", { timeout: 20000 });

    // Step 3 – Ensure theater rows exist
    cy.get(".theater-row", { timeout: 20000 })
      .should("have.length.at.least", 1)
      .first()
      .as("firstTheater");

    // Step 4 – Click view button
    cy.get("@firstTheater").find(".btn-view").click();

    // Step 5 – Wait for auditorium API
    cy.intercept("GET", "**/api/theaters/*/auditoriums").as("loadAuditoriums");
    cy.wait("@loadAuditoriums", { timeout: 20000 });
  });

  it("renders auditorium page", () => {
    cy.contains("Auditorium", { timeout: 10000 }).should("exist");
    cy.get(".auditorium-row").should("have.length.at.least", 1);
  });

  it("opens Add Auditorium modal", () => {
    cy.contains("Add Auditorium").click();
    cy.contains("Add New Auditorium").should("be.visible");
  });

  it("opens Edit Auditorium modal", () => {
    cy.get(".auditorium-row").first().find(".btn-edit").click();
    cy.contains("Edit Auditorium").should("exist");
  });

  it("opens seat layout modal", () => {
    cy.get(".auditorium-row").first().find(".btn-view").click();
    cy.contains("Seat Layout").should("exist");
  });

  it("navigates back to Theaters", () => {
    cy.contains("← Back to Theaters").click();
    cy.contains("Theater Management").should("exist");
  });
});
