import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderStatus.css";

const CheckoutSuccess = () => {
  const { state } = useLocation();

  // ✅ FIXED LINE
  const orderId = state?.orderId || "N/A";
  const totalAmount = state?.totalAmount || 0;
  const deliveryStartDate = state?.deliveryStartDate;
  const deliveryEndDate = state?.deliveryEndDate;
  const paymentMethod = "Cash on Delivery";

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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="checkout-status-wrapper">
      <div className="status-card success">
        {/* Animated Success Icon */}
        <div className="status-icon-animated"></div>

        <h1>Order Confirmed 🎉</h1>
        <p className="order-summary-tagline">
          Thank you for your order! Your items will be delivered as per the
          schedule below.
        </p>

        {/* ORDER DETAILS */}
        <div className="order-details-card">
          

          <p className="detail-row">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value cod-badge">
              {paymentMethod}
            </span>
          </p>

          <p className="detail-row total-paid">
            <span className="detail-label">
              Amount to Pay on Delivery:
            </span>
            <span className="detail-value">
              ₹{Number(totalAmount).toFixed(2)}
            </span>
          </p>
        </div>

        {/* DELIVERY INFO */}
        <div className="delivery-info">
          {deliveryStartDate && deliveryEndDate ? (
            <>
              <p>
                📦 <strong>Delivery Period:</strong>
              </p>
              <p>
                {formatDate(deliveryStartDate)} →{" "}
                {formatDate(deliveryEndDate)}
              </p>
            </>
          ) : (
            <p>📦 Your delivery schedule will be shared shortly.</p>
          )}

          <p className="small-text">
            Please keep the exact amount ready at the time of delivery.
          </p>
        </div>

        {/* ACTION BUTTONS */}
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
