import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import api from "../../api/api.jsx"; // Axios instance
import { useCart } from "../../context/CartContext.jsx"; // Cart context
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const backendBase = api.defaults.baseURL.replace("/api", "");

        const formattedProducts = res.data.map((item) => ({
          ...item,
          img: item.img ? `${backendBase}${item.img}` : "/placeholder.png",
          prices: {
            oneTime: item.prices?.oneTime || 0,
            threeDays: item.prices?.threeDays || 0,
            sevenDays: item.prices?.sevenDays || 0,
            thirtyDays: item.prices?.thirtyDays || 0,
          },
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOrder = (item) => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      // Not logged in → redirect to login page
      navigate("/login");
      return;
    }

    // Logged in → add to cart and navigate to cart
    addToCart(item);
    navigate("/cart");
  };

  if (loading) return <p className="loading-text">Loading products...</p>;
  if (!products.length) return <p className="loading-text">No products found.</p>;

  return (
    <div className="food-section">
      <h2 className="food-heading">
        Healthy Crunch. Premium Taste. <span className="clortxt">Professional Energy.</span>
      </h2>

      <div className="food-grid">
        {products.map((item) => (
          <div className="food-card-modern" key={item._id}>
            <div className="food-image-wrap">
              <img src={item.img} alt={item.name} className="food-image" />
              <div className="food-rating">⭐ {item.rating || 0}</div>
            </div>

            <div className="food-details">
              <h3 className="food-title">{item.name}</h3>
              <p className="food-desc">{item.desc}</p>

              <div className="food-price-options">
                <div className="price-chip">One-Time <b>₹{item.prices.oneTime}</b></div>
                <div className="price-chip">3 Days <b>₹{item.prices.threeDays}</b></div>
                <div className="price-chip">7 Days <b>₹{item.prices.sevenDays}</b></div>
                <div className="price-chip">30 Days <b>₹{item.prices.thirtyDays}</b></div>
              </div>
            </div>

            <button className="food-order-btn" onClick={() => handleOrder(item)}>
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
