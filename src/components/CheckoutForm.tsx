import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import React from "react";

const CheckoutForm = () => {
  const checkoutState = useCheckout();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (checkoutState.type === "loading") return <div>Loading...</div>;
    if (checkoutState.type === "error")
      return <div>Error: {checkoutState.error.message}</div>;

    const { checkout } = checkoutState;
    const result = await checkout.confirm();

    if (result.type === "error") {
      console.log(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <p>Choose Card payment above and click Submit.</p>
      <button>Submit</button>
    </form>
  );
};

export default CheckoutForm;
