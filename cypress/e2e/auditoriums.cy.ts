/// <reference types="cypress" />

const API =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

describe("Auditorium Management Page", () => {
  beforeEach(() => {
    // Always open a valid theater ID
    cy.visit("/auditoriums/1");

    // Wait for initial API load
    cy.intercept("GET", "**/api/theaters/1/auditoriums").as("loadAuditoriums");
  });

  // --------------------------------------------------------------------
  it("renders essential UI elements", () => {
    cy.contains("← Back to Theaters").should("be.visible");
    cy.contains("Search auditoriums...").should("exist");
    cy.contains("➕ Add Auditorium").should("exist");

    cy.get(".auditorium-table").should("exist");
  });

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
  it("opens Add Auditorium modal", () => {
    cy.contains("➕ Add Auditorium").click();

    cy.contains("Add New Auditorium").should("be.visible");

    cy.get("input").first().should("have.value", "");
    cy.contains("Save Auditorium").should("exist");
  });

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
  it("opens seat layout modal", () => {
    cy.get(".auditorium-row").first().find(".btn-view").click();

    cy.contains("Seat Layout").should("exist");
    cy.contains("SCREEN").should("exist");

    cy.get(".seat").should("have.length.greaterThan", 0);

    cy.contains("Close").click();
  });

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
    cy.contains("← Back to Theaters").click();
    cy.url().should("include", "/theaters");
  });
});
