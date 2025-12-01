import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function FinalPaymentSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.session || !state?.booking) {
    return <div>Invalid payment summary</div>;
  }

  const { session, booking } = state;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🎉 Ticket Confirmed!</h1>

      {/* Movie Poster */}
      <div style={{ textAlign: "center" }}>
        <img
          src={booking.movie.posterUrl}
          alt={booking.movie.title}
          style={{ width: "200px", borderRadius: "10px" }}
        />
      </div>

      <h2 style={{ textAlign: "center" }}>{booking.movie.title}</h2>
      <p style={{ textAlign: "center" }}>{booking.movie.genre}</p>

      {/* Showtime + Booking Info */}
      <div
        style={{
          background: "#f3f3f3",
          padding: "15px",
          borderRadius: "10px",
          marginTop: "15px",
        }}
      >
        <p>
          <b>Booking Reference:</b> {booking.bookingRef}
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

      {/* ⭐ PAYMENT DETAILS SECTION */}
      <div
        style={{
          background: "#e8f5ff",
          padding: "15px",
          borderRadius: "10px",
          marginTop: "15px",
        }}
      >
        <h3>Payment Details</h3>
        <p>
          <b>Amount Paid:</b>{" "}
          {(session.amount_total / 100).toFixed(2)}{" "}
          {session.currency.toUpperCase()}
        </p>
        <p>
          <b>Email:</b> {session.customer_email}
        </p>
        <p>
          <b>Status:</b> {session.payment_status}
        </p>
      </div>

      {/* ⭐ TICKET BREAKDOWN SECTION (Adults + Children) */}
      <div
        style={{
          background: "#fff4e0",
          padding: "15px",
          borderRadius: "10px",
          marginTop: "15px",
        }}
      >
        <h3>Ticket Breakdown</h3>

        {booking.adultCount > 0 && (
          <p>
            <b>Adults:</b> {booking.adultCount} × €
            {booking.showtime.adultPrice.toFixed(2)} = €
            {(booking.adultCount * booking.showtime.adultPrice).toFixed(2)}
          </p>
        )}

        {booking.childCount > 0 && (
          <p>
            <b>Children:</b> {booking.childCount} × €
            {booking.showtime.childPrice.toFixed(2)} = €
            {(booking.childCount * booking.showtime.childPrice).toFixed(2)}
          </p>
        )}

        <hr />

        <p>
          <b>Total Tickets:</b> {booking.adultCount + booking.childCount}
        </p>

        <p>
          <b>Total Paid:</b> €
          {booking.total.toFixed(2)}
        </p>
      </div>

      {/* ⭐ QR CODE */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h3>Show this QR at Entrance</h3>
        <QRCode value={`booking:${booking.bookingRef}`} size={180} />
      </div>

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
