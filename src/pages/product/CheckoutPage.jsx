import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api.jsx";
import toast, { Toaster } from "react-hot-toast";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./CheckoutPage.css";

const { RangePicker } = DatePicker;

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "cod",
    deliveryStartDate: null,
    deliveryEndDate: null,
  });

  // Prefill user info if logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
      }));
    }
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + (item.selectedOptionPrice || item.prices?.oneTime || 0) * item.quantity,
    0
  );

  if (!cartItems.length)
    return <p className="empty-checkout">Your cart is empty.</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (dates) => {
    if (!dates) return;
    setFormData({
      ...formData,
      deliveryStartDate: dates[0],
      deliveryEndDate: dates[1],
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.deliveryStartDate ||
      !formData.deliveryEndDate
    ) {
      toast.error("Please fill all fields and select delivery dates!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to place an order!");
        return;
      }

      // Build order data
      const orderData = {
        deliveryStartDate: formData.deliveryStartDate.format("YYYY-MM-DD"),
        deliveryEndDate: formData.deliveryEndDate.format("YYYY-MM-DD"),
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.selectedOptionPrice || item.prices?.oneTime || 0,
          selectedOption: item.selectedOption || "oneTime",
        })),
        totalAmount,
      };

      // Send to backend
      await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🎉 Booking successful!");
      clearCart();

      setTimeout(() => {
        navigate("/bookings");
      }, 1500);
    } catch (err) {
      console.error("Order failed:", err);
      const message =
        err.response?.data?.message || "Server error while placing order!";
      toast.error(`❌ ${message}`);
    }
  };

  return (
    <div className="checkout-container">
      <Toaster position="top-right" />
      <Link to="/" className="back-link">
        ← Back to Cart
      </Link>
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-content">
        {/* Left: Cart Items */}
        <div className="checkout-cart">
          <h2>Your Order</h2>
          {cartItems.map((item) => (
            <div className="checkout-item-card" key={item._id}>
              <img src={item.img} alt={item.name} />
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>{item.selectedOption || "One-Time"}</p>
                <p>Qty: {item.quantity}</p>
                <p className="item-price">
                  ₹{(item.selectedOptionPrice || item.prices?.oneTime || 0) * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <h3 className="checkout-total">Total: ₹{totalAmount}</h3>
        </div>

        {/* Right: Form */}
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h2>Delivery Details</h2>

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Delivery Dates</label>
            <RangePicker
              value={
                formData.deliveryStartDate && formData.deliveryEndDate
                  ? [formData.deliveryStartDate, formData.deliveryEndDate]
                  : []
              }
              onChange={handleDateChange}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          <button type="submit" className="btn-place-order">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
