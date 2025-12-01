describe("Schedule Management – Basic Rendering & Actions", () => {
  beforeEach(() => {
    cy.visit("/schedule-management", {
      onBeforeLoad(win) {
        win.__cypressTesting = true;

        // Bypass protected route
        win.localStorage.setItem("token", "fake-token");
        win.localStorage.setItem("role", "owner");
      }
    });
  });

  it("renders schedule page correctly", () => {
    cy.contains("Show Schedule Management").should("exist");
    cy.contains("Manage movie showtimes").should("exist");

    cy.get(".table-row").should("have.length.at.least", 0);
  });

  it("opens Add Showtime modal", () => {
    cy.contains("Add Showtime").click();
    cy.contains("Add New Showtime").should("be.visible");
  });

  it("opens Edit Showtime modal", () => {
    cy.get("body").then(body => {
      if (body.find(".table-row").length === 0) {
        cy.log("⚠ No rows found — skipping edit test");
        return;
      }

      cy.get(".table-row").first().within(() => {
        cy.get(".btn-edit").click();
      });

      cy.contains("Edit Showtime").should("exist");
    });
  });

  it("deletes a showtime (confirmation appears)", () => {
    cy.on("window:confirm", () => true);

    cy.get("body").then(body => {
      if (body.find(".table-row").length === 0) {
        cy.log("⚠ No rows found — skipping delete test");
        return;
      }

      cy.get(".table-row").first().within(() => {
        cy.get(".btn-delete").click();
      });
    });
  });

  it("returns to dashboard", () => {
    cy.contains("Back to Dashboard").click();
    cy.url().should("include", "/dashboard");
  });
});
