import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/payment.css";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="payment-container">
        <h2>Invalid Payment Session</h2>
        <button onClick={() => navigate("/home")}>Go Home</button>
      </div>
    );
  }

  const {
    bookingRef,
    movie,
    showtime,
    seats,
    total,
    email,
    transactionId,
    adultCount,
    childCount,
  } = state;

  return (
    <div className="payment-page">

      {/* Success Icon */}
      <div className="success-icon">
        <span>✔</span>
      </div>

      <h1 className="payment-title">Booking Confirmed!</h1>
      <p className="payment-subtitle">Get ready for an amazing experience</p>

      {/* Booking Reference */}
      <div className="ref-box">
        <p className="ref-label">BOOKING REFERENCE NUMBER</p>
        <h2 className="ref-number">{bookingRef}</h2>
        <p className="ref-note">Save this number for future reference</p>
      </div>

      {/* Email Sent Message */}
      <div className="email-box">
        <div className="email-icon">📧</div>
        <div>
          <p className="email-title">E-Tickets Sent Successfully! ✔</p>
          <p className="email-text">
            Your e-tickets with QR codes have been sent to <b>{email}</b>
          </p>
          <p className="email-time">📅 Sent: {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Movie Card */}
      <div className="movie-summary">
        <div className="movie-poster-box">
          <img src={movie.posterUrl} alt={movie.title} />
          <div className="rating-badge">⭐ {movie.rating ?? "8.9"}</div>
        </div>

        <h2 className="movie-title">{movie.title}</h2>
        <p className="movie-genre">{movie.genre}</p>

        {/* Info Boxes */}
        <div className="info-grid">
          <div className="info-card">
            <p className="info-label">DATE & TIME</p>
            <p className="info-value">{showtime.date}</p>
            <h3 className="info-value-bold">{showtime.time}</h3>
          </div>

          <div className="info-card">
            <p className="info-label">YOUR SEATS</p>
            <h2 className="info-value-bold">{seats.join(", ")}</h2>
            <p className="info-value">Center Section</p>
          </div>

          <div className="info-card">
            <p className="info-label">LOCATION</p>
            <h3 className="info-value-bold">{showtime.theaterName}</h3>
            <p className="info-value">{showtime.address}</p>
          </div>

          <div className="info-card">
            <p className="info-label">DURATION</p>
            <h3 className="info-value-bold">{movie.durationMinutes}</h3>
            <p className="info-value">minutes</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="payment-summary">
        <h2>Payment Summary</h2>

        <p className="summary-row">
          Adult Tickets × {adultCount}
          <span>€{(adultCount * movie.adultPrice).toFixed(2)}</span>
        </p>

        <p className="summary-row">
          Child Tickets × {childCount}
          <span>€{(childCount * movie.childPrice).toFixed(2)}</span>
        </p>

        <div className="summary-details">
          <p>Payment Method</p>
          <span>Credit Card (****1234)</span>

          <p>Transaction ID</p>
          <span>{transactionId}</span>
        </div>

        <div className="total-box">
          <p>Total Amount Paid</p>
          <h2>€{total.toFixed(2)}</h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn download">⬇ Download</button>
        <button className="btn print">🖨 Print</button>
        <button className="btn share">🔗 Share</button>
        <button className="btn viewqr">🧾 View QR</button>
      </div>

      {/* Navigation */}
      <button className="btn home" onClick={() => navigate("/home")}>
        🏠 Back to Home
      </button>

      <button className="btn book-again" onClick={() => navigate("/home")}>
        🎬 Book Another Movie
      </button>

      {/* Footer */}
      <p className="support">
        Need assistance?  
        <br />
        support@northstarcinemas.com · +358 8 5542 3890 · Help Center
      </p>

    </div>
  );
}
