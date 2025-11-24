import React, { useState, useEffect } from "react";
import "../../styles/booking.css";

export default function BookingPage() {
  const [availableSeats, setAvailableSeats] = useState([
    "A1","A2","A3","A4","A5","A6","A7","A8","A9"
  ]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  const adultPrice = 10;   // example
  const childPrice = 5;    // example

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = adultCount * adultPrice + childCount * childPrice;

  return (
    <div className="booking-container">

      {/* Movie Header */}
      <div className="movie-header">
        <img 
          src="https://via.placeholder.com/100x150"
          alt="poster"
          className="movie-poster"
        />

        <div>
          <h2 className="movie-title">The Great Adventure</h2>
          <p className="movie-info">Adventure • 130 minutes</p>
        </div>
      </div>

      {/* Seat Selection */}
      <h3 className="section-title">Choose Seats</h3>
      <div className="seat-grid">
        {availableSeats.map((seat) => (
          <button
            key={seat}
            className={
              selectedSeats.includes(seat) ? "seat-btn selected" : "seat-btn"
            }
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>

      {/* Adult / Child Counters */}
      <h3 className="section-title">Tickets</h3>

      <div className="ticket-row">
        <span>Adult</span>
        <div className="count-box">
          <button onClick={() => adultCount > 0 && setAdultCount(adultCount - 1)}>-</button>
          <span>{adultCount}</span>
          <button onClick={() => setAdultCount(adultCount + 1)}>+</button>
        </div>
      </div>

      <div className="ticket-row">
        <span>Child</span>
        <div className="count-box">
          <button onClick={() => childCount > 0 && setChildCount(childCount - 1)}>-</button>
          <span>{childCount}</span>
          <button onClick={() => setChildCount(childCount + 1)}>+</button>
        </div>
      </div>

      {/* Matching seats vs ticket count */}
      <p className="warning">
        {selectedSeats.length !== adultCount + childCount
          ? `Please select exactly ${adultCount + childCount} seats`
          : ""}
      </p>

      {/* Summary Section */}
      <div className="summary">
        <div>Total Price</div>
        <div>${totalPrice}</div>
      </div>

      {/* Buttons */}
      <button className="book-btn">BOOK NOW</button>
      <button className="trailer-btn">WATCH TRAILER</button>

    </div>
  );
}
