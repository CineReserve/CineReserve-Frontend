<<<<<<< HEAD
/// <reference types="cypress" />

const API =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

describe("Auditorium Management Page", () => {
=======
describe("Auditorium Management – Real Backend", () => {

>>>>>>> 6a3e90c (update every admin pages in a same style)
  beforeEach(() => {
    // Step 1 – Visit page
    cy.intercept("GET", "**/api/cities").as("loadCities");
    cy.intercept("GET", "**/api/theaters").as("loadTheaters");

<<<<<<< HEAD
    // Wait for initial API load
    cy.intercept("GET", "**/api/theaters/1/auditoriums").as("loadAuditoriums");
=======
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
>>>>>>> 6a3e90c (update every admin pages in a same style)
  });

  it("renders auditorium page", () => {
    cy.contains("Auditorium", { timeout: 10000 }).should("exist");
    cy.get(".auditorium-row").should("have.length.at.least", 1);
  });

<<<<<<< HEAD
  // --------------------------------------------------------------------
  it("shows loaded auditoriums", () => {
    cy.get(".auditorium-row").should("have.length.greaterThan", 0);
  });

  // --------------------------------------------------------------------
  it("filters auditoriums with search", () => {
    cy.get(".auditorium-search").type("auditorium");

    cy.get(".auditorium-row").each((row) => {
      cy.wrap(row).contains(/auditorium/i);
    });
  });

  // --------------------------------------------------------------------
=======
>>>>>>> 6a3e90c (update every admin pages in a same style)
  it("opens Add Auditorium modal", () => {
    cy.contains("Add Auditorium").click();
    cy.contains("Add New Auditorium").should("be.visible");
  });

<<<<<<< HEAD
  // --------------------------------------------------------------------
  it("creates a new auditorium", () => {
    cy.contains("➕ Add Auditorium").click();

    cy.get('input[value=""]').first().type("Cypress Hall");

    cy.get('input[type="number"]').eq(0).clear().type("5"); // rows
    cy.get('input[type="number"]').eq(1).clear().type("10"); // seats/row
    cy.get('input[type="number"]').eq(2).clear().type("8"); // last row

    cy.intercept("POST", `${API}/api/auditoriums`).as("createAud");

    cy.contains("Save Auditorium").click();
    cy.wait("@createAud");

    cy.contains("Cypress Hall").should("exist");
  });

  // --------------------------------------------------------------------
  it("edits an existing auditorium", () => {
    cy.get(".auditorium-row")
      .first()
      .within(() => {
        cy.get(".btn-edit").click();
      });

    cy.contains("Edit Auditorium").should("exist");

    cy.get("input").first().clear().type("Updated Hall");

    cy.intercept("PUT", `${API}/api/auditoriums/*`).as("updateAud");

    cy.contains("Save Auditorium").click();
    cy.wait("@updateAud");

    cy.contains("Updated Hall").should("exist");
  });

  // --------------------------------------------------------------------
  it("deletes an auditorium", () => {
    cy.get(".auditorium-row").first().as("firstAud");

    cy.get("@firstAud")
      .invoke("text")
      .then((textBefore) => {
        cy.get("@firstAud").find(".btn-delete").click();
        cy.on("window:confirm", () => true);

        cy.intercept("DELETE", `${API}/api/auditorium/*`).as("deleteAud");
        cy.wait("@deleteAud");

        cy.get(".auditorium-row")
          .first()
          .invoke("text")
          .should((textAfter) => {
            expect(textAfter).not.eq(textBefore);
          });
      });
  });

  // --------------------------------------------------------------------
=======
  it("opens Edit Auditorium modal", () => {
    cy.get(".auditorium-row").first().find(".btn-edit").click();
    cy.contains("Edit Auditorium").should("exist");
  });

>>>>>>> 6a3e90c (update every admin pages in a same style)
  it("opens seat layout modal", () => {
    cy.get(".auditorium-row").first().find(".btn-view").click();
    cy.contains("Seat Layout").should("exist");
  });

<<<<<<< HEAD
  // --------------------------------------------------------------------
  it("auto-calculates capacity based on row/seat numbers", () => {
    cy.contains("➕ Add Auditorium").click();

    cy.get('input[type="number"]').eq(0).clear().type("3"); // rows
    cy.get('input[type="number"]').eq(1).clear().type("10"); // seats/row
    cy.get('input[type="number"]').eq(2).clear().type("5"); // last row

    cy.contains("Total Seat Capacity: 25").should("exist");
    // (3 - 1) * 10 + 5 = 25
  });

  // --------------------------------------------------------------------
  it("handles backend load error gracefully", () => {
    cy.intercept("GET", `${API}/api/theaters/*/auditoriums`, {
      statusCode: 500,
      body: {},
    }).as("serverError");

    cy.visit("/auditoriums/1");
    cy.wait("@serverError");

    cy.contains("Failed to load auditoriums").should("exist");
  });

  // --------------------------------------------------------------------
  it("navigates back to Theaters page", () => {
=======
  it("navigates back to Theaters", () => {
>>>>>>> 6a3e90c (update every admin pages in a same style)
    cy.contains("← Back to Theaters").click();
    cy.contains("Theater Management").should("exist");
  });
});
