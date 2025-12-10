/// <reference types="cypress" />

describe("Home Page – Basic Functionality", () => {
  beforeEach(() => {
    // Stub API call for NOW SHOWING movies
    cy.intercept("POST", "**/api/movies/search", {
      statusCode: 200,
      body: [
        {
          movieID: 10,
          title: "Avatar 3",
          genre: "Sci-Fi",
          language: "English",
          durationMinutes: 180,
          posterUrl: "avatar.jpg",
          trailerUrl: "https://youtube.com/trailer123",
        },
        {
          movieID: 20,
          title: "Inside Out 3",
          genre: "Animation",
          language: "English",
          durationMinutes: 115,
          posterUrl: "insideout.jpg",
          trailerUrl: "https://youtube.com/trailer456",
        },
      ],
    }).as("fetchMovies");

    cy.visit("/home");
    cy.wait("@fetchMovies");
  });

  // --- TEST 1 ---
  it("renders Home Page correctly", () => {
    cy.contains("NORTH STAR CINEMAS").should("be.visible");
    cy.contains("NOW SHOWING").should("be.visible");
    cy.get(".city-select").should("have.value", "Oulu");
  });

  // --- TEST 2 ---
  it("loads movie cards", () => {
    cy.get(".movie-card").should("have.length", 2);

    cy.contains("Avatar 3").should("be.visible");
    cy.contains("Inside Out 3").should("be.visible");
  });

  // --- TEST 3 ---
  it("switching city triggers new fetch", () => {
    cy.intercept("POST", "**/api/movies/search", {
      statusCode: 200,
      body: [],
    }).as("fetchMoviesCity");

    cy.get(".city-select").select("Helsinki");

    cy.wait("@fetchMoviesCity");
    cy.contains("No movies available").should("be.visible");
  });

  // --- TEST 4 ---
  it("Book Now button navigates to booking page", () => {
    cy.get(".movie-card").first().within(() => {
      cy.contains("Book Now").click();
    });

    cy.url().should("include", "/booking");
  });

  // --- TEST 5 ---
  it("Trailer button opens a new window", () => {
    cy.window().then((win) => {
      cy.stub(win, "open").as("openWindow");
    });

    cy.get(".movie-card").first().find(".trailer-btn").click();

    cy.get("@openWindow").should(
      "have.been.calledWith",
      "https://youtube.com/trailer123"
    );
  });
});
