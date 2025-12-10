/// <reference types="cypress" />

describe("Booking Page – Basic Functionality", () => {
  beforeEach(() => {
  // 1️⃣ Intercept first
  cy.intercept("GET", "**/api/movies/10/showtimes", {
    statusCode: 200,
    body: [
      {
        showtimeID: 1,
        date: "2025-12-10T00:00:00",
        time: "18:00",
        auditoriumName: "Auditorium 1",
        adultPrice: 12,
        childPrice: 8,
        totalSeats: 100,
        availableSeats: 80,
      },
    ],
  }).as("fetchShowtimes");

  // 2️⃣ THEN load the page (with state)
cy.visit("/booking", {
  onBeforeLoad(win) {
    (win as any).__CY_LOCATION_STATE = {
      movieID: 10,
      movie: {
        movieID: 10,
        title: "Avatar 3",
        genre: "Sci-Fi",
        duration: 180,
        posterUrl: "avatar.jpg",
      },
    };
  },
});



  // 3️⃣ Finally wait for the GET request
  cy.wait("@fetchShowtimes");
});


  // --- TEST 1 ---
  it("renders booking page correctly", () => {
    cy.contains("← Back to Movies").should("be.visible");
    cy.contains("Select Showtime").should("be.visible");
    cy.get(".showtime-select").should("exist");
  });

  // --- TEST 2 ---
  it("back button works", () => {
    cy.contains("← Back to Movies").click();
    cy.url().should("include", "/home");
  });

  // --- TEST 3 ---
  it("can select showtime and update prices", () => {
    cy.get(".showtime-select").select("1");

    cy.contains("Available Seats").should("contain", "80");

    // After selecting showtime, UI should show prices
    cy.contains("Adult (€12)").should("exist");
    cy.contains("Child (€8)").should("exist");
  });

  // --- TEST 4 ---
  it("can increase & decrease ticket counts", () => {
    cy.get(".showtime-select").select("1");

    // Increase adult
    cy.get(".ticket-box.adult .counter button")
      .last()
      .click();

    // Increase child
    cy.get(".ticket-box.child .counter button")
      .last()
      .click();

    cy.get(".ticket-box.adult .counter span").should("contain", "1");
    cy.get(".ticket-box.child .counter span").should("contain", "1");
  });

  // --- TEST 5 ---
  it("updates total price correctly", () => {
    cy.get(".showtime-select").select("1");

    // Add 2 adults → 2 * 12 = 24
    cy.get(".ticket-box.adult .counter button").last().click();
    cy.get(".ticket-box.adult .counter button").last().click();

    // Add 1 child → 1 * 8 = 8
    cy.get(".ticket-box.child .counter button").last().click();

    cy.contains("€32.00").should("be.visible"); // total = 24 + 8
  });

  // --- TEST 6 ---
  it("requires email before enabling payment button", () => {
    cy.get(".showtime-select").select("1");

    cy.contains("PROCEED TO PAYMENT").should("be.disabled");

    cy.get("input[type=email]").type("test@example.com");

    cy.contains("PROCEED TO PAYMENT").should("not.be.disabled");
  });

  // --- TEST 7 ---
  it("submits booking and redirects to checkout", () => {
    cy.get(".showtime-select").select("1");

    // Add tickets
    cy.get(".ticket-box.adult .counter button").last().click();

    cy.get("input[type=email]").type("test@example.com");

    // Stub booking POST request
    cy.intercept("POST", "**/api/movies/booking", {
      statusCode: 200,
      body: {
        success: true,
        reservationID: 555,
      },
    }).as("submitBooking");

    cy.contains("PROCEED TO PAYMENT").click();

    cy.wait("@submitBooking");

    cy.url().should("include", "/checkout");
  });
});
