import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import empty from "./empty.png";
import "./CartPage.css";

/* ================= PLAN → ALLOWED WEEKDAYS ================= */
const PLAN_DAYS_MAP = {
  weekly3_MWF: [1, 3, 5],        // Mon Wed Fri
  weekly3_TTS: [2, 4, 6],        // Tue Thu Sat
  weekly6: [1, 2, 3, 4, 5, 6],   // Mon–Sat
  monthly: [1, 2, 3, 4, 5, 6],   // Mon–Sat
  oneTime: [1, 2, 3, 4, 5, 6],   // Mon–Sat
};

const CartPage = () => {
  const {
    cartItems,
    loading,
    isUpdating,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    updateCartItemPriceOption,
  } = useCart();

  const navigate = useNavigate();

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    bookingDate: dayjs(),
    startDate: null,
    endDate: null,
  });

  /* ================= USER PREFILL ================= */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setFormData((p) => ({
        ...p,
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
      }));
    }
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= DISABLE DATE BY PLAN ================= */
  const getDisabledDateByPlan = (plan) => {
    return (current) => {
      if (!current) return false;

      const today = dayjs().startOf("day");
      const allowedDays = PLAN_DAYS_MAP[plan] || [];

      return (
        current < today ||                 
        !allowedDays.includes(current.day()) 
      );
    };
  };

  /* ================= CORRECT END DATE CALC ================= */
  const calculateEndDate = (startDate, plan) => {
    if (!startDate || !plan) return null;

    // Monthly → 30 days
    if (plan === "monthly") {
      return dayjs(startDate).add(29, "day");
    }

    // One time → same day
    if (plan === "oneTime") {
      return dayjs(startDate);
    }

    const allowedDays = PLAN_DAYS_MAP[plan];
    let current = dayjs(startDate);
    let deliveryCount = 0;
    let lastDeliveryDate = current;

    while (deliveryCount < allowedDays.length) {
      if (allowedDays.includes(current.day())) {
        deliveryCount++;
        lastDeliveryDate = current;
      }
      current = current.add(1, "day");
    }

    return lastDeliveryDate;
  };

  /* ================= START DATE ================= */
  const handleStartDateChange = (date) => {
    if (!date) return;

    const plan = cartItems[0]?.selectedOption;

    setFormData((p) => ({
      ...p,
      startDate: date,
      endDate: calculateEndDate(date, plan),
    }));
  };

  /* ================= PRICE ================= */
  const getItemPrice = (item) => item.selectedOptionPrice ?? 0;
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  /* ================= CHECKOUT ================= */
  const handleCheckout = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.startDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    navigate("/checkout", {
      state: {
        deliveryDetails: {
          ...formData,
          bookingDate: formData.bookingDate.format("YYYY-MM-DD"),
          startDate: formData.startDate.format("YYYY-MM-DD"),
          endDate: formData.endDate
            ? formData.endDate.format("YYYY-MM-DD")
            : null,
        },
      },
    });
  };

  /* ================= STATES ================= */
  if (loading) return <div className="cart-full-loader">Loading…</div>;

  if (!cartItems.length) {
    return (
      <div className="empty-state">
        <img src={empty} alt="empty cart" />
        <h2>Your cart is empty</h2>
        <Link to="/">Explore Menu</Link>
      </div>
    );
  }

  return (
    <div className="zomato-cart-container">
      <Toaster position="top-center" />

      {/* HEADER */}
      <header className="cart-header">
        <Link to="/">
          <ArrowLeftOutlined />
        </Link>
        <h1>My Cart ({cartItems.length})</h1>
        <button onClick={clearCart} disabled={isUpdating}>
          <DeleteOutlined /> Clear Cart
        </button>
      </header>

      {/* BODY */}
      <div className="cart-body">
        <div className="items-list">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={item.img} alt={item.name} />

              <div className="item-details">
                <h3>{item.name}</h3>

                <select
                  value={item.selectedOption}
                  onChange={(e) =>
                    updateCartItemPriceOption(item._id, e.target.value)
                  }
                >
                  {Object.entries(item.prices).map(([k, v]) => (
                    <option key={k} value={k}>
                      {k} – ₹{v}
                    </option>
                  ))}
                </select>

                  <div className="item-ingredients">
                    <strong>Selected Ingredients:</strong>
                    {item.selectedIngredients?.length > 0 ? (
                      <ul>
                        {item.selectedIngredients.map((ing) => (
                          <li key={ing.ingredientId}>
                            {ing.name} ({ing.quantity})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-ingredients">
                        No extra ingredients selected
                      </p>
                    )}
                  </div>
                <div className="quantity-box">
                  <button
                    onClick={() =>
                      updateCartItemQuantity(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartItemQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DELIVERY FORM */}
        <form className="delivery-form" onSubmit={handleCheckout}>
          <h2>Delivery Details</h2>

          <label>Booking Date</label>
          <DatePicker
            value={formData.bookingDate}
            onChange={(d) =>
              setFormData((p) => ({ ...p, bookingDate: d }))
            }
            disabledDate={(d) => d && d < dayjs().startOf("day")}
            style={{ width: "100%" }}
          />

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input value={formData.email} readOnly />

          <label>Delivery Start Date</label>
          <DatePicker
            value={formData.startDate}
            onChange={handleStartDateChange}
            disabledDate={getDisabledDateByPlan(
              cartItems[0]?.selectedOption
            )}
            style={{ width: "100%" }}
          />

          {formData.endDate && (
            <input
              readOnly
              value={`End Date: ${formData.endDate.format("DD MMM YYYY")}`}
            />
          )}

          <button type="submit">
            Continue to Checkout • ₹{totalAmount}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CartPage;
