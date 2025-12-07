import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import "../../styles/finalPayment.css"; // <-- NEW STYLESHEET

export default function FinalPaymentSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.session || !state?.booking) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Invalid payment summary</h2>
          <p>No valid booking information was found.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const { session, booking } = state;

  // Poster fallback
  const poster = booking.movie?.posterUrl || "/default-poster.jpg";

  // Convert cents to euros
  const formatPrice = (priceInCents: number) => (priceInCents / 100).toFixed(2);

  const adultSubtotal = booking.adultCount * booking.showtime.adultPrice;
  const childSubtotal = booking.childCount * booking.showtime.childPrice;

  return (
     <div className="final-payment-page page-container">
      <h1 className="page-title">🎉 Ticket Confirmed!</h1>

      {/* MOVIE POSTER + TITLE */}
      <div className="card">
        <div className="poster-wrapper">
          <img
            src={poster}
            alt={booking.movie.title}
            className="movie-poster"
            onError={(e) => (e.currentTarget.src = "/default-poster.jpg")}
          />
        </div>

        <h2 className="movie-title">{booking.movie.title}</h2>
        <p className="movie-genre">{booking.movie.genre}</p>
      </div>

      {/* BOOKING DETAILS */}
      <div className="card">
        <h3 className="section-title">Booking Details</h3>

        <p>
          <b>Reference:</b> #{booking.bookingRef}
        </p>
        <p>
          <b>Date:</b> {booking.showtime.date}
        </p>
        <p>
          <b>Time:</b> {booking.showtime.time}
        </p>
        <p>
          <b>Auditorium:</b> {booking.showtime.auditoriumName}
        </p>
      </div>

      {/* PAYMENT DETAILS */}
      <div className="card">
        <h3 className="section-title">Payment Details</h3>

        <p>
          <b>Transaction ID:</b> {session.id}
        </p>
        <p>
          <b>Amount Paid:</b> €{formatPrice(session.amount_total)}
        </p>
        <p>
          <b>Email:</b> {session.customer_email}
        </p>

        <p>
          <b>Status:</b>{" "}
          <span
            className={
              session.payment_status === "paid" ? "paid-status" : "pending-status"
            }
          >
            {session.payment_status.toUpperCase()}
          </span>
        </p>
      </div>

      {/* TICKET BREAKDOWN */}
      <div className="card">
        <h3 className="section-title">Ticket Breakdown</h3>

        {booking.adultCount > 0 && (
          <p>
            Adults: {booking.adultCount} × €
            {formatPrice(booking.showtime.adultPrice)} = €
            {formatPrice(adultSubtotal)}
          </p>
        )}

        {booking.childCount > 0 && (
          <p>
            Children: {booking.childCount} × €
            {formatPrice(booking.showtime.childPrice)} = €
            {formatPrice(childSubtotal)}
          </p>
        )}

        <hr />

        <p>
          <b>Total Tickets:</b> {booking.adultCount + booking.childCount}
        </p>

        <p>
          <b>Total Paid:</b> €{formatPrice(session.amount_total)}
        </p>
      </div>

      {/* QR CODE CARD */}
      <div className="card qr-card">
        <h3 className="section-title">Show This QR at Entrance</h3>

        <div className="qr-container">
          <QRCode
            value={`booking:${booking.bookingRef}|session:${session.id}`}
            size={180}
          />
        </div>

        <p className="qr-note">Booking ID: {booking.bookingRef}</p>
      </div>

      {/* BACK BUTTON */}
      <button className="primary-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}
