import React, { useEffect, useState } from "react";
import api from "../../api/api";
import dayjs from "dayjs";
import "./BookingList.css";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function load() {
      try {
        const res = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Bookings:", res.data);

        // ⭐ Add full backend image URL
        const backendBase = api.defaults.baseURL.replace("/api", "");

        const formatted = res.data.map(order => ({
          ...order,
          items: order.items.map(item => ({
            ...item,
            image: item.image
              ? `${backendBase}${item.image}`
              : "/placeholder.png",
          })),
        }));

        setBookings(formatted);

      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="loading">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="empty-booking">No bookings found.</p>;

  return (
    <div className="booking-container">
      <h1 className="booking-title">My Bookings</h1>

      <div className="booking-list">
        {bookings.map(order => (
          <div className="booking-card" key={order._id}>

            <div className="booking-header">
              <h3>Booking #{order._id.slice(-6)}</h3>
              <span className={`status ${order.status}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <p>
              <strong>Delivery:</strong>{" "}
              {dayjs(order.deliveryStartDate).format("DD MMM")} →
              {dayjs(order.deliveryEndDate).format("DD MMM")}
            </p>

            <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

            <div className="booking-items">
              {order.items.map(item => (
                <div className="booking-item" key={item.productId}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <small>
                      {item.selectedOption} — Qty: {item.quantity}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <button className="view-btn">View Details</button>

          </div>
        ))}
      </div>
    </div>
  );
}
