import React, { useState } from "react";
import "../../styles/bookingModern.css";

export default function BookingPage() {
  const movie = {
    title: "Dune: Part Two",
    genre: "Sci-Fi, Adventure",
    duration: 166,
    poster: "https://m.media-amazon.com/images/M/MV5BM2Y3Njc4ZmUt.jpg",
    date: "2024-11-25",
    time: "18:00",
    theater: "Cinema Nova Oulu",
    auditorium: "Auditorium 1",
  };

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [email, setEmail] = useState("");

  const adultPrice = 12.5;
  const childPrice = 8.0;

  const seats = ["A1", "A2", "A5", "A6", "B1", "B2", "B5", "B6", "C1", "C2"];

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = adult * adultPrice + child * childPrice;

  return (
    <div className="booking-page">
      <button className="back-btn">← Back to Movies</button>

      <div className="booking-card">
        {/* Left Poster */}
        <img src={movie.poster} className="left-poster" />

        {/* Movie Info */}
        <div className="movie-details">
          <h2>{movie.title}</h2>
          <p className="movie-meta">
            {movie.genre} • {movie.duration} minutes
          </p>

          <div className="info-grid">
            <div className="info-box">
              <span className="label">Theater</span>
              <span className="value">{movie.theater}</span>
            </div>

            <div className="info-box">
              <span className="label">Auditorium</span>
              <span className="value">{movie.auditorium}</span>
            </div>

            <div className="info-box">
              <span className="label">Date & Time</span>
              <span className="value">
                {movie.date} at {movie.time}
              </span>
            </div>

            <div className="info-box timer">
              <span className="label">Time Remaining</span>
              <span className="value time-red">5:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Seats */}
      <h3 className="section-title">Choose Seats</h3>

      <div className="screen-box">SCREEN</div>

      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat}
            className={
              selectedSeats.includes(seat)
                ? "seat seat-selected"
                : "seat"
            }
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>

      <div className="legend">
        <span className="legend-box available"></span> Available
        <span className="legend-box selected"></span> Selected
      </div>

      {/* Tickets */}
      <h3 className="section-title">Tickets</h3>

      <div className="ticket-box-container">
        <div className="ticket-box adult">
          <span>Adult (€{adultPrice})</span>
          <div className="counter">
            <button onClick={() => adult > 0 && setAdult(adult - 1)}>-</button>
            <span>{adult}</span>
            <button onClick={() => setAdult(adult + 1)}>+</button>
          </div>
        </div>

        <div className="ticket-box child">
          <span>Child (€{childPrice})</span>
          <div className="counter">
            <button onClick={() => child > 0 && setChild(child - 1)}>-</button>
            <span>{child}</span>
            <button onClick={() => setChild(child + 1)}>+</button>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="email-section">
        <label>Email Address *</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Total */}
      <div className="total-box">
        <span>Total Price</span>
        <span className="price">€{totalPrice.toFixed(2)}</span>
      </div>

      <button className="payment-btn">PROCEED TO PAYMENT</button>
    </div>
  );
}
