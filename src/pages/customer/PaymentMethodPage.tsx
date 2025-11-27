import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/payment-method.css";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [method, setMethod] = useState("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [agree, setAgree] = useState(false);

  const handlePay = () => {
    if (method === "card" && (!cardName || !cardNumber || !expiry || !cvv)) {
      alert("Please fill your card details");
      return;
    }
    if (!agree) {
      alert("You must agree to the Terms & Conditions");
      return;
    }

    // Create fake transaction ID
    const transactionId = "TXN-" + Math.floor(Math.random() * 999999999);

    navigate("/payment", {
      state: {
        ...state,
        transactionId,
        paymentMethod: method,
      },
    });
  };

  return (
    <div className="payment-method-container">

      <div className="payment-method-box">

        <h2>Payment Method</h2>

        {/* CARD */}
        <div 
          className={`method-item ${method === "card" ? "active" : ""}`}
          onClick={() => setMethod("card")}
        >
          <input type="radio" checked={method === "card"} readOnly />
          <div>
            <h3>Credit / Debit Card</h3>
            <p>Visa, Mastercard, Amex</p>
          </div>
        </div>

        {/* CARD FORM */}
        {method === "card" && (
          <div className="card-form">
            <input 
              type="text" 
              placeholder="Cardholder Name" 
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Card Number"
              maxLength={16}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />

            <div className="row">
              <input 
                type="text" 
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="CVV"
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* PayPal */}
        <div 
          className={`method-item ${method === "paypal" ? "active" : ""}`}
          onClick={() => setMethod("paypal")}
        >
          <input type="radio" checked={method === "paypal"} readOnly />
          <div>
            <h3>PayPal</h3>
            <p>Fast and secure</p>
          </div>
        </div>

        {/* Mobile Payment */}
        <div 
          className={`method-item ${method === "mobile" ? "active" : ""}`} 
          onClick={() => setMethod("mobile")}
        >
          <input type="radio" checked={method === "mobile"} readOnly />
          <div>
            <h3>Mobile Payment</h3>
            <p>Apple Pay, Google Pay</p>
          </div>
        </div>

        {/* Terms */}
        <label className="terms">
          <input 
            type="checkbox" 
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          I agree to the Terms & Conditions
        </label>

        {/* PAY BUTTON */}
        <button className="pay-btn" onClick={handlePay}>
          PAY €{state?.total ?? 0}
        </button>

        <p className="secure-text">🔒 Secure SSL Encrypted Payment</p>

      </div>
    </div>
  );
}
