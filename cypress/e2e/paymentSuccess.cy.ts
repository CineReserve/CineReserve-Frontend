/// <reference types="cypress" />

describe("Payment Success Page", () => {
  // Utility: Visit with correct route
  const visitWithSession = () => {
    cy.visit("/paymentSuccess?session_id=test123");
  };

  // --- TEST 1 ---
  it("shows loader initially", () => {
    cy.intercept("GET", "**/payment-summary?session_id=test123", {
      delay: 1500, // simulate slow network
      body: {},
    }).as("paymentSummary");

    visitWithSession();
    
    cy.contains("Loading payment result...").should("be.visible");

    cy.wait("@paymentSummary");
  });

  // --- TEST 2 ---
  it("shows error when stripe field is missing", () => {
    cy.intercept("GET", "**/payment-summary?session_id=test123", {
      statusCode: 200,
      body: {
        bookingId: 111,
        movieTitle: "Avatar 3",
        stripe: null, // missing stripe => error state
      },
    }).as("paymentSummary");

    visitWithSession();
    cy.wait("@paymentSummary");

    cy.contains("Invalid payment result").should("be.visible");
  });

  // --- TEST 3 ---
  it("renders success message when payment is valid", () => {
    cy.intercept("GET", "**/payment-summary?session_id=test123", {
      statusCode: 200,
      body: {
        bookingId: 555,
        movieTitle: "Avatar 3",
        showDate: "2025-12-10",
        showTime: "18:00",
        auditorium: "Hall A",
        adultCount: 2,
        childCount: 1,
        adultPrice: 12,
        childPrice: 8,
        totalAmount: 32,
        status: "paid",
        email: "customer@example.com",
        stripe: {
          id: "cs_test_123",
          payment_status: "paid",
          amount_total: 3200,
          currency: "eur",
          customer_email: "customer@example.com",
        },
      },
    }).as("paymentSummary");

    visitWithSession();
    cy.wait("@paymentSummary");

    cy.contains("Payment Verified ✔").should("be.visible");
    cy.contains("Continue to Ticket Summary").should("be.visible");
  });

  // --- TEST 4 ---
  it("navigates to /final-payment-summary when button is clicked", () => {
    cy.intercept("GET", "**/payment-summary?session_id=test123", {
      statusCode: 200,
      body: {
        bookingId: 555,
        movieTitle: "Avatar 3",
        showDate: "2025-12-10",
        showTime: "18:00",
        auditorium: "Hall A",
        adultCount: 2,
        childCount: 1,
        adultPrice: 12,
        childPrice: 8,
        totalAmount: 32,
        status: "paid",
        email: "customer@example.com",
        stripe: {
          id: "cs_test_123",
          payment_status: "paid",
          amount_total: 3200,
          currency: "eur",
          customer_email: "customer@example.com",
        },
      },
    }).as("paymentSummary");

    visitWithSession();
    cy.wait("@paymentSummary");

    cy.contains("Continue to Ticket Summary").click();

    cy.url().should("include", "/final-payment-summary");
  });
});
