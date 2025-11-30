import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FinalPaymentSummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.session || !state?.booking) {
    return <div>Invalid payment summary</div>;
  }

  // ✔ Correct: session + booking loaded here
  const { session, booking } = state;

  return (
    <div style={{ padding: 20 }}>
      <h1>🎉 Ticket Confirmed!</h1>

      <p>
        <b>Amount Paid:</b> {(session.amount_total / 100).toFixed(2)}{" "}
        {session.currency?.toUpperCase()}
      </p>

      <p>
        <b>Email:</b> {session.customer_email}
      </p>

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}
