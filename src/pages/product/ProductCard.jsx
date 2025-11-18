import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import api from "../../api/api.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend API
        const res = await api.get("/products");
        // Get the backend base URL (e.g., 'http://localhost:8800' from 'http://localhost:8800/api')
        const backendBase = api.defaults.baseURL.replace("/api", "");

        const formattedProducts = res.data.map((item) => ({
          ...item,
          // Construct the full image URL
          img: item.img ? `${backendBase}${item.img}` : "/placeholder.png",
          // Ensure prices object and properties exist to prevent runtime errors
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
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleOrder = (item) => {
    // Check if the user is authenticated (simplified check)
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Add item to cart context and navigate to cart page
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
          // **Corrected className (removed trailing comma)**
          <div
            key={item._id}
            className="food-card-modern clickable-card"
            onClick={() => handleOrder(item)}
            onKeyDown={(e) => {
              // Handle keyboard accessibility (Enter/Space to activate card)
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOrder(item);
              }
            }}
            role="button" // Indicates the div is interactive
            tabIndex={0} // Makes the div focusable
            aria-label={`Order ${item.name}`}
          >
            <div className="food-image-wrap">
              <img src={item.img} alt={item.name} className="food-image" />
              <div className="food-rating">⭐ {item.rating || 4.8}</div>
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

            <button
              className="food-order-btn"
              onClick={(e) => {
                // Stop propagation so clicking the button doesn't also trigger the parent div's onClick
                e.stopPropagation(); 
                handleOrder(item);
              }}
            >
              Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;