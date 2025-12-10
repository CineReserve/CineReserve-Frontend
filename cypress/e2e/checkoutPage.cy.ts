/// <reference types="cypress" />

describe("Checkout Page", () => {
  const mockBooking = {
    bookingId: 777,
    email: "test@example.com",
    movie: { title: "Avatar 3" },
    total: 32, // €32.00
  };

  const mockSessionResponse = {
    client_secret: "test_secret_123",
  };

  beforeEach(() => {
    // 1️⃣ Stub BEFORE page load — CRITICAL
    cy.intercept("POST", "**/create-checkout-session", {
      statusCode: 200,
      delay: 500, // allow loader to be visible
      body: mockSessionResponse,
    }).as("createSession");

    // 2️⃣ Set localStorage BEFORE visit
    cy.visit("/checkout", {
      onBeforeLoad(win) {
        win.localStorage.setItem("bookingInfo", JSON.stringify(mockBooking));
      },
    });
  });

  // --- TEST 1 ---
  it("shows loader initially", () => {
    cy.contains("Loading payment...").should("be.visible");
  });

  // --- TEST 2 ---
  it("loads Stripe CheckoutForm after client secret arrives", () => {
    cy.wait("@createSession");

    // Stripe injects iframes into DOM
    cy.get("iframe").should("exist");
  });

  // --- TEST 3 ---
  it("sends correct payload to /create-checkout-session", () => {
    cy.wait("@createSession").then((interception) => {
      expect(interception.request.body).to.deep.equal({
        bookingId: mockBooking.bookingId,
        customerEmail: mockBooking.email,
        price_data: {
          currency: "EUR",
          product_data: { name: "Avatar 3 Ticket" },
          unit_amount: 3200,
        },
        quantity: 1,
      });
    });
  });
});
