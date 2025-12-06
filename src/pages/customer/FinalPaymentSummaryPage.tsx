import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function FinalPaymentSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.session || !state?.booking) {
    console.log("INVALID STATE:", state);
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Invalid payment summary</h2>
        <p>No valid booking data found. Please return to home and try again.</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  const { session, booking } = state;

  // Helper function to format price from cents to euros with 2 decimals
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Calculate subtotals
  const adultSubtotal = booking.adultCount * booking.showtime.adultPrice;
  const childSubtotal = booking.childCount * booking.showtime.childPrice;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>🎉 Ticket Confirmed!</h1>

      {/* Movie Poster with fallback */}
      <div style={{ textAlign: "center" }}>
        <img
          src={booking.movie.posterUrl}
          alt={booking.movie.title}
          style={{ 
            width: "200px", 
            height: "300px", 
            objectFit: "cover", 
            borderRadius: "10px" 
          }}
          onError={(e) => {
            e.currentTarget.src = "/default-poster.jpg";
          }}
        />
      </div>

      <h2 style={{ textAlign: "center" }}>{booking.movie.title}</h2>
      <p style={{ textAlign: "center", color: "#666" }}>{booking.movie.genre}</p>

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
          <b>Booking Reference:</b> #{booking.bookingRef}
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

      {/* PAYMENT DETAILS SECTION */}
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
            style={{
              color: session.payment_status === "paid" ? "green" : "orange",
              fontWeight: "bold",
            }}
          >
            {session.payment_status.toUpperCase()}
          </span>
        </p>
      </div>

      {/* TICKET BREAKDOWN SECTION */}
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
            {formatPrice(booking.showtime.adultPrice)} = €
            {formatPrice(adultSubtotal)}
          </p>
        )}

        {booking.childCount > 0 && (
          <p>
            <b>Children:</b> {booking.childCount} × €
            {formatPrice(booking.showtime.childPrice)} = €
            {formatPrice(childSubtotal)}
          </p>
        )}

        <hr style={{ margin: "10px 0" }} />

        <p>
          <b>Total Tickets:</b> {booking.adultCount + booking.childCount}
        </p>

        <p>
          <b>Total Paid:</b> €{formatPrice(booking.total)}
        </p>

        {/* Verify totals match */}
        {booking.total !== adultSubtotal + childSubtotal && (
          <p style={{ color: "orange", fontSize: "0.9em", marginTop: "5px" }}>
            <i>Note: Total includes processing fees</i>
          </p>
        )}
      </div>

      {/* QR CODE */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <h3>Show this QR at Entrance</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            background: "white",
          }}
        >
          <QRCode
            value={`booking:${booking.bookingRef}|session:${session.id}`}
            size={180}
          />
        </div>
        <p style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
          Booking ID: {booking.bookingRef}
        </p>
      </div>

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}