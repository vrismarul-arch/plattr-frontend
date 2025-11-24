import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderStatus.css"; // reuse same CSS file as CheckoutSuccess

const CheckoutFailure = () => {
  const { state } = useLocation();
  const errorMessage = state?.error || "Something went wrong with your order.";

  return (
    <div className="checkout-status-wrapper">
      <div className="status-card failure">
        {/* Animated Failure Icon */}
        <div className="status-icon-animated">❌</div>

        <h1>Order Failed</h1>
        <p className="order-summary-tagline">{errorMessage}</p>

        <div className="status-actions">
          <Link to="/cart" className="status-btn primary">
            Back to Cart
          </Link>
          <Link to="/" className="status-btn secondary-ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFailure;
