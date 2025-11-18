import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
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
    name: "", address: "", phone: "", email: "", paymentMethod: "cod",
    deliveryStartDate: null, deliveryEndDate: null, oneTimeDate: null,
  });

  // Prefill from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
      }));
    }
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.selectedOptionPrice || item.prices.oneTime) * item.quantity,
    0
  );

  const isOneTime = cartItems.every(item => item.selectedOption === "oneTime");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOneTimeChange = (date) => {
    setFormData({ ...formData, oneTimeDate: date, deliveryStartDate: date, deliveryEndDate: date });
  };

  const handleRangeChange = (dates) => {
    if (!dates) return;
    setFormData({ ...formData, deliveryStartDate: dates[0], deliveryEndDate: dates[1] });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || !formData.email || !formData.deliveryStartDate) {
      toast.error("Please fill all fields and select delivery date!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Login required!"); return; }

      const orderData = {
        deliveryStartDate: formData.deliveryStartDate.format("YYYY-MM-DD"),
        deliveryEndDate: formData.deliveryEndDate
          ? formData.deliveryEndDate.format("YYYY-MM-DD")
          : formData.deliveryStartDate.format("YYYY-MM-DD"),
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.selectedOptionPrice || item.prices.oneTime,
          selectedOption: item.selectedOption || "oneTime",
        })),
        totalAmount,
      };

      await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order placed successfully!");
      clearCart();
      setTimeout(() => navigate("/bookings"), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed!");
    }
  };

  if (!cartItems.length) {
    return (
      <div className="empty-checkout-state">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-4816553-4000581.png" alt="empty" />
        <h2>Nothing to checkout</h2>
        <Link to="/" className="go-back-btn">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="zomato-checkout-wrapper">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />

      {/* Header */}
      <header className="checkout-header">
        <Link to="/cart" className="back-arrow">Back</Link>
        <h1>Checkout</h1>
      </header>

      <div className="checkout-main">
        {/* Left: Order Summary */}
        <div className="order-summary">
          <h2>Your Order ({cartItems.length} items)</h2>
          {cartItems.map(item => (
            <div key={item._id} className="order-item">
              <img src={item.img} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="plan">{item.selectedOption || "One-Time"}</p>
                <p className="qty">Qty: {item.quantity}</p>
              </div>
              <div className="item-price">
                ₹{(item.selectedOptionPrice || item.prices.oneTime) * item.quantity}
              </div>
            </div>
          ))}

          <div className="total-section">
            <div className="total-line">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="total-line">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="total-line grand-total">
              <strong>Total Amount</strong>
              <strong>₹{totalAmount}</strong>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <form className="delivery-form" onSubmit={handleCheckout}>
          <h2>Delivery Details</h2>

          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <textarea name="address" placeholder="Complete Address (with area, landmark)" value={formData.address} onChange={handleChange} required />

          <div className="row">
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="date-section">
            <label>Delivery Date{!isOneTime && " Range"}</label>
            {isOneTime ? (
              <DatePicker
                value={formData.oneTimeDate}
                onChange={handleOneTimeChange}
                disabledDate={d => d && d < dayjs().startOf("day")}
                format="DD MMM, YYYY"
                placeholder="Select delivery date"
                style={{ width: "100%" }}
                required
              />
            ) : (
              <RangePicker
                value={formData.deliveryStartDate && formData.deliveryEndDate
                  ? [formData.deliveryStartDate, formData.deliveryEndDate]
                  : null}
                onChange={handleRangeChange}
                disabledDate={d => d && d < dayjs().startOf("day")}
                format="DD MMM, YYYY"
                placeholder={["Start Date", "End Date"]}
                style={{ width: "100%" }}
                required
              />
            )}
          </div>

          <div className="payment-section">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Pay Online (Coming Soon)</option>
            </select>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order • ₹{totalAmount}
          </button>
         </form>
      </div>
    </div>
  );
};

export default CheckoutPage;