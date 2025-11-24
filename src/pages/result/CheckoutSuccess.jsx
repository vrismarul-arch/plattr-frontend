import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderStatus.css";

const CheckoutSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || "N/A";
  const totalAmount = state?.totalAmount || 0;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="checkout-status-wrapper">
      <div className="status-card success">
        {/* Animated Success Icon */}
        <div className="status-icon-animated"></div>

        <h1>Order Placed Successfully!</h1>
        <p className="order-summary-tagline">
          Thank you for shopping with us! Below are your order details.
        </p>

        {/* Order Details Card */}
        <div className="order-details-card">
         

          <hr />

          <p className="detail-row total-paid">
            <span className="detail-label">Total Paid:</span>
            <span className="detail-value">₹{totalAmount.toFixed(2)}</span>
          </p>
        </div>

        {/* Delivery Info */}
        <div className="delivery-info">
          <p>
            Your estimated delivery is <strong>Friday, Nov 22nd, 2025</strong>.
          </p>
          <p className="small-text">
            You will receive a tracking link via email shortly.
          </p>
        </div>

        {/* Actions */}
        <div className="status-actions">
          <Link to="/bookings" className="status-btn primary">
            View My Orders
          </Link>
          <Link to="/" className="status-btn secondary-ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
