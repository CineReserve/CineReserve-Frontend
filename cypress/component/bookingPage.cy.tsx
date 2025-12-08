import "../../support/component";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import BookingPage from "../../../src/pages/customer/BookingPage";

describe("Booking Page Basic Test", () => {
  it("mounts the component", () => {
    cy.mount(
      <MemoryRouter initialEntries={[{ pathname: "/booking", state: { movieID: 10, movie: {} } }]}>
        <Routes>
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </MemoryRouter>
    );

    cy.contains("Select Showtime");
  });
});
