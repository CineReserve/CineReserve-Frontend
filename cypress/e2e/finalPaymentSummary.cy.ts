/// <reference types="cypress" />

describe("Final Payment Summary Page", () => {
  const mockSession = {
    id: "cs_test_123",
    payment_status: "paid",
    amount_total: 3200, // €32.00
    currency: "eur",
    customer_email: "test@example.com",
  };

  const mockBooking = {
    bookingRef: 555,
    total: 32,
    adultCount: 2,
    childCount: 1,
    movie: {
      title: "Avatar 3",
      posterUrl: "avatar.jpg",
      genre: "Sci-Fi",
    },
    showtime: {
      date: "2025-12-10",
      time: "18:00",
      adultPrice: 1200,
      childPrice: 800,
      auditoriumName: "Hall A",
    },
  };

  // ✔ Option B — Inject Router State Manually
  const visitWithInjectedState = () => {
    cy.visit("/final-payment-summary", {
      onBeforeLoad(win) {
        (win as any).__CY_LOCATION_STATE = {
          session: mockSession,
          booking: mockBooking,
        };
      },
    });
  };

  // --- TEST 1 ---
  it("shows error when no state is provided", () => {
    cy.visit("/final-payment-summary");

    cy.contains("Invalid payment summary").should("be.visible");
  });

  // --- TEST 2 ---
  it("renders full ticket summary correctly", () => {
    visitWithInjectedState();

    // ✔ match emoji + text (regex ignores emoji)
    cy.contains(/Ticket Confirmed/i).should("be.visible");

    cy.contains("Avatar 3").should("be.visible");
    cy.contains("Sci-Fi").should("be.visible");

    cy.contains("#555").should("be.visible");
    cy.contains("2025-12-10").should("be.visible");
    cy.contains("18:00").should("be.visible");
    cy.contains("Hall A").should("be.visible");

    cy.contains("€32.00").should("be.visible");
    cy.contains("PAID").should("be.visible");

    cy.contains("Adults: 2 × €12.00 = €24.00").should("be.visible");
    cy.contains("Children: 1 × €8.00 = €8.00").should("be.visible");

    // ✔ QR code exists
    cy.get(".qr-container canvas, .qr-container svg").should("exist");
  });

  // --- TEST 3 ---
 it("Back to Home button works", () => {
  visitWithInjectedState();

  cy.contains("Back to Home").click();

  // Correct assertion based on your routes
  cy.location("pathname").should("eq", "/");
});

});
