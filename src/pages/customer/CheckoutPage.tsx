import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const API_URL = import.meta.env.VITE_API_URL;
console.log("PUBLIC KEY:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log("API URL:", import.meta.env.VITE_API_URL);

export default function CheckoutPage() {
  const booking = JSON.parse(localStorage.getItem("bookingInfo") || "{}");

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!clientSecret) {
      fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          customerEmail: booking.email,
          price_data: {
            currency: "EUR",
            product_data: {
              name: `${booking.movie.title} Ticket`,
            },
            unit_amount: Math.round(booking.total * 100),
          },
          quantity: 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("SESSION RESPONSE:", data);
          setClientSecret(data.client_secret);
        });
    }
  }, []);

  if (!clientSecret) return <div>Loading payment...</div>;

  return (
    <CheckoutProvider
  stripe={stripePromise}
  options={{
    clientSecret,
   
  }}
>
      <CheckoutForm />
    </CheckoutProvider>
  );
}
