import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const booking = JSON.parse(localStorage.getItem("bookingInfo") || "{}");

  const promise = useMemo(() => {
    return fetch("http://localhost:3000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieTitle: booking.movie.title,
        amount: booking.total,
        email: booking.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: promise }}
    >
      <CheckoutForm />
    </CheckoutProvider>
  );
}
