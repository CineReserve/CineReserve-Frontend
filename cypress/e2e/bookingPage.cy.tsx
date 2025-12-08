describe("Booking Page (General Passing Test)", () => {
  const movie = {
    movieID: 10,
    title: "Avatar",
    genre: "Sci-Fi",
    duration: 120,
    posterUrl: "avatar.jpg",
  };

  const mockShowtimes = [
    {
      showtimeID: 1,
      date: "2025-01-01",
      time: "18:00",
      auditoriumName: "Room 1",
      adultPrice: 10,
      childPrice: 7,
      availableSeats: 30,
    },
  ];

  beforeEach(() => {
    cy.visit("/booking?movieID=10", {
      onBeforeLoad(win) {
        // Inject router state manually
        win.history.replaceState(
          { movieID: 10, movie },
          "",
          "/booking?movieID=10"
        );

        // MOCK FETCH before app loads
        cy.stub(win, "fetch")
          .callsFake((url) => {
            if (url.includes("/showtimes")) {
              return Promise.resolve({
                json: () => Promise.resolve(mockShowtimes),
              });
            }
            if (url.includes("/booking")) {
              return Promise.resolve({
                json: () =>
                  Promise.resolve({
                    success: true,
                    reservationID: "RES-12345",
                  }),
              });
            }

            // Default fallback for Stripe errors
            return Promise.resolve({
              json: () => Promise.resolve({}),
            });
          })
          .as("mockFetch");
      },
    });
  });

  it("performs a complete booking flow", () => {
    // Select showtime
    cy.get("select.showtime-select").select("1");

    // Add tickets
    cy.contains("Adult").parent().find("button").contains("+").click();
    cy.contains("Child").parent().find("button").contains("+").click();

    // Add email
    cy.get("input[type='email']").type("test@example.com");

    // Click payment button
    cy.contains("PROCEED TO PAYMENT").click();

    // Validate booking stored locally
    cy.window().then((win) => {
      const booking = JSON.parse(win.localStorage.getItem("bookingInfo"));
      expect(booking).to.exist;
      expect(booking.bookingId).to.equal("RES-12345");
      expect(booking.adultCount).to.equal(1);
      expect(booking.childCount).to.equal(1);
      expect(booking.email).to.equal("test@example.com");
    });

    // Validate redirect
    cy.location("pathname").should("eq", "/checkout");
  });
});
