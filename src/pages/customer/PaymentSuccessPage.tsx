import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const booking = JSON.parse(localStorage.getItem("bookingInfo") || "{}");
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:3000/session-status?session_id=${sessionId}`)
        .then((r) => r.json())
        .then((data) => {
          setSession(data);
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) return <div>Loading payment status...</div>;
  if (!session) return <div>No session found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>

      <button
        onClick={() =>
          navigate("/final-payment-summary", {
            state: { session, booking },
          })
        }
      >
        Continue to Ticket Summary
      </button>
    </div>
  );
}
