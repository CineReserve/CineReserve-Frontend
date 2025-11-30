import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/bookingModern.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieID = location.state?.movieID;
  const movie = location.state?.movie;

  if (!movieID || !movie) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Invalid booking session</h2>
        <button onClick={() => navigate("/home")}>Go Home</button>
      </div>
    );
  }

  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);

  const [adultPrice, setAdultPrice] = useState(0);
  const [childPrice, setChildPrice] = useState(0);

  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/movies/${movieID}/showtimes`)
      .then((res) => res.json())
      .then((data) => setShowtimes(Array.isArray(data) ? data : []));
  }, [movieID]);

  const totalPrice = adult * adultPrice + child * childPrice;

  console.log("DEBUG");
  console.log("selectedShowtime:", selectedShowtime);
  console.log("email:", email);
  console.log("adult:", adult);
  console.log("child:", child);
  console.log("totalTickets:", adult + child);

  const handleBooking = async () => {
    if (!selectedShowtime) {
      alert("Select a showtime");
      return;
    }
    if (!email) {
      alert("Enter your email");
      return;
    }
    if (adult + child === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const payload = {
      movieID: movie.movieID,
      showtimeID: selectedShowtime.showtimeID,
      customerEmail: email,
      numberOfAdults: adult,
      numberOfChildren: child,
    };

    try {
      const response = await fetch(`${API_URL}/api/movies/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(
          "bookingInfo",
          JSON.stringify({
            bookingRef: data.reservationID,
            movie,
            showtime: selectedShowtime,
            total: totalPrice,
            email,
            transactionId: "TXN-" + Math.floor(Math.random() * 99999999),
            adultCount: adult,
            childCount: child,
          })
        );
        navigate("/checkout");
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (err) {
      alert("Booking error.");
    }
  };

  return (
    <div className="booking-page">
      <p className="back-btn" onClick={() => navigate("/home")}>
        ← Back to Movies
      </p>

      <div className="booking-card">
        <img src={movie.posterUrl} className="left-poster" />

        <div className="movie-details">
          <h2>{movie.title}</h2>
          <p className="movie-meta">
            {movie.genre} • {movie.duration} minutes
          </p>
        </div>
      </div>

      <h3 className="section-title">Select Showtime</h3>

      <select
        onChange={(e) => {
          const st = showtimes.find(
            (s) => s.showtimeID === Number(e.target.value)
          );
          setSelectedShowtime(st);
          setAdultPrice(Number(st?.adultPrice));
          setChildPrice(Number(st?.childPrice));
        }}
      >
        <option value="">-- Select Showtime --</option>
        {showtimes.map((s) => {
          const readableDate = new Date(s.date).toLocaleDateString("en-FI");
          return (
            <option key={s.showtimeID} value={s.showtimeID}>
              {readableDate} • {s.time} • {s.auditoriumName}
            </option>
          );
        })}
      </select>
      {selectedShowtime && (
        <p className="available-seats-info">
          Available Seats: <strong>{selectedShowtime.availableSeats}</strong>
        </p>
      )}

      <h3 className="section-title">Tickets</h3>

      <div className="ticket-box-container">
        {/* Adult */}
        <div className="ticket-box adult">
          <span>Adult (€{adultPrice})</span>
          <div className="counter">
            <button onClick={() => adult > 0 && setAdult(adult - 1)}>-</button>
            <span>{adult}</span>
            <button
              onClick={() => {
                const total = adult + child;
                if (total >= selectedShowtime?.availableSeats) {
                  alert("Not enough seats left.");
                  return;
                }
                setAdult(adult + 1);
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Child */}
        <div className="ticket-box child">
          <span>Child (€{childPrice})</span>
          <div className="counter">
            <button onClick={() => child > 0 && setChild(child - 1)}>-</button>
            <span>{child}</span>
            <button
              onClick={() => {
                const total = adult + child;
                if (total >= selectedShowtime?.availableSeats) {
                  alert("Not enough seats left.");
                  return;
                }
                setChild(child + 1);
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="email-section">
        <label>Email Address *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="total-box">
        <span>Total Price</span>
        <span className="price">€{totalPrice.toFixed(2)}</span>
      </div>

      <button
        className="payment-btn"
        onClick={handleBooking}
        disabled={!email} // disable button when email empty
        style={{
          opacity: !email ? 0.5 : 1,
          cursor: !email ? "not-allowed" : "pointer",
        }}
      >
        PROCEED TO PAYMENT
      </button>
    </div>
  );
}
