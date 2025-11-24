import React from "react";
import "./OrderStatus.css";
import successImg from "./salad.png"; // Success image
import failureImg from "./salad.png"; // Failure image (you need to add this)

const OrderStatus = ({ type = "success", orderId, totalAmount, onAction }) => {
  const isSuccess = type === "success";

  return (
    <div className="order-status-wrapper">
      <div className={`status-card ${isSuccess ? "success" : "failure"}`}>
        <div className="status-icon">
          <img
            src={isSuccess ? successImg : failureImg}
            alt={isSuccess ? "Success" : "Failure"}
            className="status-image"
          />
        </div>

        <h1>{isSuccess ? "Awesome!" : "Failed"}</h1>

        <p className="status-message">
          {isSuccess
            ? "Congratulations. Your order is accepted!"
            : "Oops! Something went terribly wrong here."}
        </p>

        {isSuccess && totalAmount && (
          <p className="order-info">Total Paid: ₹{totalAmount}</p>
        )}
        {!isSuccess && (
          <p className="order-info">Your payment wasn't completed.</p>
        )}

        <button
          className={`status-btn ${isSuccess ? "success-btn" : "failure-btn"}`}
          onClick={onAction}
        >
          {isSuccess ? "More Hungry, Let's do again" : "Please try again"}
        </button>
      </div>
    </div>
  );
};

export default OrderStatus;
