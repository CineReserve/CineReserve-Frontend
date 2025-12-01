describe("Schedule Management Page – Basic Functionality", () => {
  beforeEach(() => {
    // Visit page first
    cy.visit("/schedule-management", {
      onBeforeLoad(win) {
        // Mark that Cypress is testing (your app may optionally use this)
        win.__cypressTesting = true;

        // Prevent Cypress from failing if __setAuth is not ready yet
        win.__setAuth = undefined;
      },
    });

    // Wait until React creates window.__setAuth inside useEffect
    cy.window()
      .its("__setAuth")
      .should("be.a", "function");

    // 🚀 Now safely set fake authentication
    cy.window().then((win) => {
      win.__setAuth("fake-token", "owner"); // owner role allowed
    });

    // ----- STUB THEATERS -----
    cy.intercept("GET", "**/api/theaters", {
      statusCode: 200,
      body: [{ theaterID: 1, theaterName: "Cinema Nova Oulu" }],
    }).as("fetchTheaters");

    // ----- STUB MOVIES -----
    cy.intercept("GET", "**/api/movies", {
      statusCode: 200,
      body: [{ movieID: 3, title: "Dune: Part Two" }],
    }).as("fetchMovies");

    // ----- STUB SHOWTIMES -----
    cy.intercept("POST", "**/api/movies/showtimes/search", {
      statusCode: 200,
      body: [
        {
          showtimeID: 1,
          movieID: 3,
          theaterID: 1,
          theaterName: "Cinema Nova Oulu",
          auditoriumID: 79,
          auditoriumName: "Auditorium 1",
          date: "2025-11-29T00:00:00",
          startTime: "19:00",
          endTime: "21:00",
          adultPrice: 15,
          childPrice: 9,
          totalSeats: 100,
          availableSeats: 60,
        },
      ],
    }).as("fetchShows");
  });

  // --- TEST 1 ---
  it("renders the Schedule Management page correctly", () => {
    cy.contains("Show Schedule Management").should("be.visible");
    cy.wait("@fetchShows");
    cy.get(".table-row").should("have.length.at.least", 1);
  });

  // --- TEST 2 ---
  it("opens Add Showtime modal", () => {
    cy.contains("➕ Add Showtime").click();
    cy.contains("Add New Showtime").should("be.visible");
    cy.get(".modal").should("be.visible");
  });

  // --- TEST 3 ---
  it("opens Edit Showtime modal", () => {
    cy.wait("@fetchShows");
    cy.get(".table-row").first().find(".btn-edit").click();
    cy.contains("Edit Showtime").should("be.visible");
  });

  // --- TEST 4 ---
  it("applies filters and searches", () => {
    cy.wait("@fetchTheaters");

    cy.get("select").first().select("Cinema Nova Oulu");
    cy.get('input[type="date"]').type("2025-11-29");

    cy.contains("🔍 Search").click();
    cy.wait("@fetchShows");

    cy.get(".table-row").should("have.length", 1);
  });

  // --- TEST 5 ---
  it("allows deleting a showtime", () => {
    cy.wait("@fetchShows");

    // Auto-confirm delete popup
    cy.on("window:confirm", () => true);

    cy.intercept("DELETE", "**/api/movies/showtimes/*", {
      statusCode: 200,
      body: { message: "Deleted successfully" },
    }).as("deleteShow");

    cy.get(".table-row").first().find(".btn-delete").click();
    cy.wait("@deleteShow");
  });

  // --- TEST 6 ---
  it("returns back to Dashboard", () => {
    cy.contains("← Back to Dashboard").click();
    cy.url().should("include", "/dashboard");
  });
});
