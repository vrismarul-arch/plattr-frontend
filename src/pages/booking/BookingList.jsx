import React, { useEffect, useState } from "react";
import api from "../../api/api";
import dayjs from "dayjs";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaListUl,
} from "react-icons/fa";
import "./BookingList.css";

/* ================= HELPERS ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const getPlanLabel = (option) => {
  switch (option) {
    case "oneTime":
      return "One-Time Purchase";
    case "monthly":
      return "Monthly Subscription";
    case "weekly3_MWF":
      return "Weekly (Mon • Wed • Fri)";
    case "weekly3_TTS":
      return "Weekly (Tue • Thu • Sat)";
    case "weekly6":
      return "Weekly (Mon → Sat)";
    default:
      return option;
  }
};

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadBookings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map((order, idx) => ({
          ...order,
          uid: order.orderId || `booking-${order._id}-${idx}`,
        }));

        setBookings(formatted);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) return <p className="loading">Loading your order history...</p>;

  if (!bookings.length)
    return (
      <div className="empty-state">
        <FaBoxOpen size={48} className="empty-icon" />
        <p className="empty-booking">You haven't placed any orders yet.</p>
      </div>
    );

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">Order History</h1>

      <div className="booking-list">
        {bookings.map((order) => {
          const isExpanded = expandedOrder === order.orderId;

          return (
            <div className="booking-card" key={order.uid}>
              {/* ================= HEADER ================= */}
              <div
                className="booking-header"
                onClick={() => toggleExpand(order.orderId)}
                style={{ cursor: "pointer" }}
              >
                <div className="order-id-info">
                  <span className="label">Order ID</span>
                  <h3 className="id-value">{order.orderId}</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                  {isExpanded ? (
                    <FaChevronUp style={{ marginLeft: 8 }} />
                  ) : (
                    <FaChevronDown style={{ marginLeft: 8 }} />
                  )}
                </div>
              </div>

              {isExpanded && (
                <>
                  <hr className="divider" />

                  {/* ================= SUMMARY ================= */}
                  <div className="booking-summary-row">
                    <div className="summary-item">
                      <FaCalendarAlt className="summary-icon" />
                      <span className="summary-label">Delivery Window</span>
                      <p className="summary-value">
                        {dayjs(order.deliveryStartDate).format("MMM DD")} –{" "}
                        {dayjs(order.deliveryEndDate).format("MMM DD, YYYY")}
                      </p>
                    </div>

                    <div className="summary-item">
                      <FaDollarSign className="summary-icon" />
                      <span className="summary-label">Total Paid</span>
                      <p className="summary-value amount">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <hr className="divider" />

                  {/* ================= ITEMS ================= */}
                  <div className="booking-items-expanded">
                    <h4>Items</h4>

                    {order.items.map((item) => (
                      <div className="item-detail" key={item._id}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-image-thumb"
                        />

                        <div className="item-info">
                          <strong>{item.name}</strong>

                          {/* ✅ PLAN */}
                          <p>
                            <strong>Plan:</strong>{" "}
                            {getPlanLabel(item.selectedOption)}
                          </p>

                          <p>Qty: {item.quantity}</p>
                          <p>Price: {formatCurrency(item.price)}</p>

                          {/* ✅ INGREDIENTS */}
                          {item.selectedIngredients?.length > 0 && (
                            <div className="ingredient-section">
                              <FaListUl className="ingredient-icon" />
                              <span className="ingredient-title">
                                Selected Ingredients:
                              </span>
                              <ul className="ingredient-list">
                                {item.selectedIngredients.map((ing, idx) => (
                                  <li key={idx}>
                                    {ing.name} ({ing.quantity})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.fullProduct?.desc && (
                            <p className="item-desc">
                              {item.fullProduct.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
