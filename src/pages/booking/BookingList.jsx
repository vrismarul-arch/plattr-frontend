import React, { useEffect, useState } from "react";
import api from "../../api/api";
import dayjs from "dayjs";
import "./BookingList.css";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadBookings = async () => {
      try {
        const res = await api.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const backendBase = api.defaults.baseURL.replace("/api", "");

        const formatted = res.data.map((order, orderIndex) => ({
          ...order,
          uid: `booking-${order._id}-${orderIndex}`,
          items: order.items.map((item, itemIndex) => {
            let imageUrl = "/placeholder.png";
            if (item.image) {
              if (item.image.startsWith("http")) imageUrl = item.image;
              else imageUrl = `${backendBase}${item.image}`;
            }
            return {
              ...item,
              uid: `item-${item.productId}-${itemIndex}`,
              image: imageUrl,
            };
          }),
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

  if (loading) return <p className="loading">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="empty-booking">No bookings found.</p>;

  return (
    <div className="booking-container">
      <h1 className="booking-title">My Bookings</h1>
      <div className="booking-list">
        {bookings.map((order) => (
          <div className="booking-card" key={order.uid}>
            <div className="booking-header">
              <h3>Booking {order.orderId}</h3> {/* Use backend orderId */}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <p>
              <strong>Delivery:</strong>{" "}
              {dayjs(order.deliveryStartDate).format("DD MMM")} →{" "}
              {dayjs(order.deliveryEndDate).format("DD MMM")}
            </p>

            <p>
              <strong>Total Amount:</strong> ₹{order.totalAmount}
            </p>

            <div className="booking-items">
              {order.items.map((item) => (
                <div className="booking-item" key={item.uid}>
                  {/* <img src={item.image} alt={item.name} /> */}
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
