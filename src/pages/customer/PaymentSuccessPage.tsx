import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type PaymentSummary = {
  bookingId: number;
  movieTitle: string;
  showDate: string;
  showTime: string;
  auditorium: string;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  totalAmount: number;
  status: string;
  email: string;
  stripe?: {
    id: string;
    payment_status: string;
    amount_total: number;
    currency: string;
    customer_email: string;
  };
  // Add these if your API provides them
  posterUrl?: string;
  genre?: string;
};

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [paymentData, setPaymentData] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      setIsLoading(true);
      fetch(`${API_URL}/payment-summary?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data: PaymentSummary) => {
          console.log("PAYMENT SUMMARY:", data);
          setPaymentData(data);
        })
        .catch((err) => {
          console.error("Failed to fetch payment summary:", err);
          setError("Failed to load payment details. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setError("No session ID provided");
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleContinue = () => {
    if (!paymentData?.stripe) {
      setError("Invalid payment data");
      return;
    }

    // ⭐ CRITICAL: Navigate to FinalPaymentSummary with ALL required data
    navigate("/final-payment-summary", {
      state: {
        session: paymentData.stripe,
        booking: {
          bookingRef: paymentData.bookingId,
          total: paymentData.totalAmount,
          adultCount: paymentData.adultCount,
          childCount: paymentData.childCount,
          movie: {
            title: paymentData.movieTitle,
            // Use actual posterUrl from API or provide a safe default
            posterUrl: paymentData.posterUrl || "/default-poster.jpg",
            genre: paymentData.genre || "Unknown Genre",
          },
          showtime: {
            date: paymentData.showDate,
            time: paymentData.showTime,
            adultPrice: paymentData.adultPrice,
            childPrice: paymentData.childPrice,
            auditoriumName: paymentData.auditorium,
          },
        },
      },
    });
  };

  if (isLoading) {
    return <div>Loading payment result...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  if (!paymentData?.stripe) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Invalid Payment</h2>
        <p>No valid payment data found.</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Verified ✔</h1>
      <p>Your payment was successful! Booking ID: {paymentData.bookingId}</p>
      <p>Movie: {paymentData.movieTitle}</p>
      <p>Total: ${(paymentData.totalAmount / 100).toFixed(2)}</p>
      
      <button onClick={handleContinue} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Continue to Ticket Summary
      </button>
    </div>
  );
}