import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/bookingModern.css";

export default function BookingPage() {
  const navigate = useNavigate();

  // TODO: These values will come from Home/Movie page via navigate()
  const movie = {
    movieID: 2,
    showtimeID: 5,
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

  const seats = ["A1", "A2", "A5", "A6", "B1", "B2", "B5", "B6", "C1", "C2"];

  const adultPrice = 12.5;
  const childPrice = 8.0;

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = adult * adultPrice + child * childPrice;

  // ---------------------------
  // 🔥 BOOKING (MOCK MODE)
  // ---------------------------
  const handleBooking = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // -------------------------
    // ⛔ BACKEND COMMENTED OUT
    // -------------------------
    /*
    try {
      const response = await fetch(
        "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net/api/movie/booking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (data.success) {
        // navigate...
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred. Please try again.");
    }
    */

    // -------------------------
    // ✔ MOCK SUCCESS RESPONSE
    // -------------------------
    const mockReservationID =
      Math.floor(Math.random() * 900000) + 100000;

    navigate("/payment", {
      state: {
        bookingRef: mockReservationID,
        movie: {
          title: movie.title,
          genre: movie.genre,
          durationMinutes: movie.duration,
          posterUrl: movie.poster,
          adultPrice: adultPrice,
          childPrice: childPrice,
        },
        showtime: {
          date: movie.date,
          time: movie.time,
          theaterName: movie.theater,
          address: "Oulu, Finland",
        },
        seats: selectedSeats,
        total: totalPrice,
        email: email,
        transactionId: "TXN-" + Math.floor(Math.random() * 99999999),
        adultCount: adult,
        childCount: child,
      },
    });
  };

  return (
    <div className="booking-page">
      <p
        className="back-btn"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer", color: "#bbb" }}
      >
        ← Back to Movies
      </p>

      {/* MAIN MOVIE CARD */}
      <div className="booking-card">
        <img src={movie.poster} className="left-poster" />

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

      {/* Seats */}
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

      {/* Ticket selection */}
      <h3 className="section-title">Tickets</h3>

      <div className="ticket-box-container">
        <div className="ticket-box adult">
          <span>Adult (€{adultPrice})</span>
          <div className="counter">
            <button onClick={() => adult > 0 && setAdult(adult - 1)}>
              -
            </button>
            <span>{adult}</span>
            <button onClick={() => setAdult(adult + 1)}>+</button>
          </div>
        </div>

        <div className="ticket-box child">
          <span>Child (€{childPrice})</span>
          <div className="counter">
            <button onClick={() => child > 0 && setChild(child - 1)}>
              -
            </button>
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

      {/* Proceed */}
      <button className="payment-btn" onClick={handleBooking}>
        PROCEED TO PAYMENT
      </button>
    </div>
  );
}
