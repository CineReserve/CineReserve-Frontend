import React, { useState } from "react";
import "../../styles/payment.css";

export default function PaymentPage() {
  const movieTitle = "The Great Adventure";
  const dateTime = "April 25, 2024, 4:30 PM";
  const theater = "Cinema 1";
  const seats = "A5, A6";
  const totalPrice = 20.0;

  const [method, setMethod] = useState<string>("");

  return (
    <div className="payment-container">
      <h1 className="payment-title">Payment</h1>

      {/* Summary */}
      <h3 className="summary-title">Order Summary</h3>
      <div className="summary-box">
        <p className="summary-movie">{movieTitle}</p>
        <p className="summary-info">{dateTime}</p>
        <p className="summary-info">{theater}, Seats {seats}</p>
      </div>

      {/* Payment Methods */}
      <div className="method-box">
        <button
          className={method === "card" ? "method-btn active" : "method-btn"}
          onClick={() => setMethod("card")}
        >
          Credit Card
        </button>

        <button
          className={method === "paypal" ? "method-btn active" : "method-btn"}
          onClick={() => setMethod("paypal")}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="paypal-logo"
          />
        </button>

        <button
          className={method === "mobile" ? "method-btn active" : "method-btn"}
          onClick={() => setMethod("mobile")}
        >
          Mobile Payment
        </button>
      </div>

      {/* Total */}
      <div className="total-row">
        <span>Total</span>
        <span className="total-price">${totalPrice.toFixed(2)}</span>
      </div>

      {/* Pay Button */}
      <button className="pay-btn">PAY</button>
    </div>
  );
}
