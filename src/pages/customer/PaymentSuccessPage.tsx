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
};

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  // FIX: TYPED STATE
  const [paymentData, setPaymentData] = useState<PaymentSummary | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${API_URL}/payment-summary?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("PAYMENT SUMMARY:", data);
          setPaymentData(data);
        });
    }
  }, [sessionId]);

  // Show loader first
  if (!paymentData) {
    return <div>Loading payment result...</div>;
  }

  //  Show error if stripe field missing
  if (!paymentData.stripe) {
    return <div>Invalid payment result</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Verified ✔</h1>

      <button
        onClick={() =>
          navigate("/final-payment-summary", {
            state: {
              session: paymentData.stripe, // stripe section
              booking: {
                bookingRef: paymentData.bookingId,
                total: paymentData.totalAmount,
                adultCount: paymentData.adultCount,
                childCount: paymentData.childCount,

                movie: {
                  title: paymentData.movieTitle,
                  posterUrl: "/default-poster.jpg",
                  genre: "",
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
          })
        }
      >
        Continue to Ticket Summary
      </button>
    </div>
  );
}
