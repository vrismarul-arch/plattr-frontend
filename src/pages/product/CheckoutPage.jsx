import React from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api/api.jsx";
import dayjs from "dayjs";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const { deliveryDetails } = location.state || {};

  if (!deliveryDetails) {
    navigate("/cart");
    return null;
  }const getPlanLabel = (option) => {
  switch (option) {
    case "oneTime":
      return "One Time Purchase";
    case "monthly":
      return "Monthly Subscription";
    case "weekly3_MWF":
      return "Weekly (Mon • Wed • Fri)";
    case "weekly3_TTS":
      return "Weekly (Tue • Thu • Sat)";
    case "weekly6":
      return "Weekly (Mon → Sat)";
    default:
      return "Plan";
  }
};


  // ✅ Convert string → dayjs safely
  const bookingDate = dayjs(deliveryDetails.bookingDate);
  const startDate = dayjs(deliveryDetails.startDate);
  const endDate = deliveryDetails.endDate
    ? dayjs(deliveryDetails.endDate)
    : null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.selectedOptionPrice * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Login required");
        navigate("/login");
        return;
      }

      const payload = {
        bookingDate: bookingDate.format("YYYY-MM-DD"),
        deliveryStartDate: startDate.format("YYYY-MM-DD"),
        deliveryEndDate: endDate ? endDate.format("YYYY-MM-DD") : null,
        paymentMethod: deliveryDetails.paymentMethod,

        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.selectedOptionPrice,
          selectedOption: item.selectedOption,
          selectedIngredients: item.selectedIngredients || [],
        })),

        totalAmount,
      };

      await api.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearCart();
      navigate("/checkout-success");
    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }
  };

  if (!cartItems.length) {
    return (
      <div className="empty-checkout-state">
        <h2>No items to checkout</h2>
        <Link to="/">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="zomato-checkout-wrapper">
      <Toaster position="top-center" />

      <header className="checkout-header">
        <Link to="/cart">Edit Cart</Link>
        <h1>Review & Place Order</h1>
      </header>

      <div className="checkout-main">
        <div className="order-summary">
  <h2>Your Order</h2>

  {cartItems.map((item) => (
    <div key={item._id} className="order-item">
      <img src={item.img} alt={item.name} />

      <div className="item-details">
        <h3>{item.name}</h3>

        {/* ✅ PLAN */}
        <p className="plan-name">
          {getPlanLabel(item.selectedOption)}
        </p>

        <p>Qty: {item.quantity}</p>

        {/* ✅ INGREDIENTS */}
        {item.selectedIngredients?.length > 0 && (
          <ul className="ingredient-list">
            {item.selectedIngredients.map((ing) => (
              <li key={ing.ingredientId}>
                {ing.name} ({ing.quantity})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ PRICE */}
      <div className="item-price">
        <p>
          ₹{item.selectedOptionPrice} × {item.quantity}
        </p>
        <strong>
          ₹{item.selectedOptionPrice * item.quantity}
        </strong>
      </div>
    </div>
  ))}

  {/* ✅ GRAND TOTAL */}
  <h3 className="total">
    Total: ₹{totalAmount}
  </h3>
</div>

        <div className="delivery-review">
          <h2>Delivery Details</h2>

          <p><strong>Booking Date:</strong> {bookingDate.format("DD MMM YYYY")}</p>
          <p><strong> Order Start Date:</strong> {startDate.format("DD MMM YYYY")}</p>

          {endDate && (
            <p><strong>Order Start End Date:</strong> {endDate.format("DD MMM YYYY")}</p>
          )}

          <p><strong>Name:</strong> {deliveryDetails.name}</p>
          <p><strong>Phone:</strong> {deliveryDetails.phone}</p>
          <p><strong>Address:</strong> {deliveryDetails.address}</p>

          <button className="place-order-btn" onClick={placeOrder}>
            Place Order • ₹{totalAmount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
