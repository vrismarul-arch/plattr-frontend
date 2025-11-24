import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import api from "../../api/api.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen.jsx";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ================================
  // FETCH PRODUCTS
  // ================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");

        const formattedProducts = res.data.map((item) => ({
          ...item,

          img: item.img || "/placeholder.png",

          // 🟢 MAP PRICES SAFELY
          prices: {
            oneTime: item.prices?.oneTime || 0,
            monthly: item.prices?.monthly || 0,

            weekly3_MWF: item.prices?.weekly3?.monWedFri || 0,
            weekly3_TTS: item.prices?.weekly3?.tueThuSat || 0,

            weekly6: item.prices?.weekly6?.monToSat || 0,

            // NEW PACK PRICES
            threeDays: item.prices?.threeDays || 0,
            sevenDays: item.prices?.sevenDays || 0,
            thirtyDays: item.prices?.thirtyDays || 0,
          },

          // 🟢 NEW FIELDS FROM BACKEND
          totalQuantity: item.totalQuantity || "",
          ingredients: item.ingredients || [],
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

  // ================================
  // ADD TO CART HANDLER
  // ================================
  const handleOrder = (item) => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(item);
    navigate("/cart");
  };

  // ================================
  // LOADING + EMPTY STATES
  // ================================
  if (loading) return <LoadingScreen text="Loading your delicious meals..." />;

  if (!products.length)
    return <p className="loading-text">No products found.</p>;

  // ================================
  // RENDER UI
  // ================================
  return (
    <div className="food-section">
      <h2 className="food-heading">
        Healthy Crunch. Premium Taste.{" "}
        <span className="clortxt">Professional Energy.</span>
      </h2>

      <div className="food-grid">
        {products.map((item) => (
          <div
            key={item._id}
            className="food-card-modern clickable-card"
            onClick={() => handleOrder(item)}
            role="button"
            tabIndex={0}
          >
            {/* IMAGE + RATING */}
            <div className="food-image-wrap">
              <img src={item.img} alt={item.name} className="food-image" />
              <div className="food-rating">⭐ {item.rating}</div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="food-details">
              <h3 className="food-title">{item.name}</h3>
              <p className="food-desc">{item.desc}</p>

              {/* ============================
                 TOTAL QUANTITY
              =============================== */}
              {item.totalQuantity && (
                <p className="food-qty">
                  <b>Quantity:</b> {item.totalQuantity}
                </p>
              )}

              {/* ============================
                 INGREDIENT LIST
              =============================== */}
              {item.ingredients.length > 0 && (
                <div className="ingredient-box">
                  <b>Ingredients:</b>
                  <ul className="ingredient-list">
                    {item.ingredients.map((ing) => (
                      <li key={ing._id}>
                        {ing.name} — <strong>{ing.quantity}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ============================
                 PRICE OPTIONS
              =============================== */}
              <div className="food-price-options">

                <div className="price-chip">
                  One-Time <b>₹{item.prices.oneTime}</b>
                </div>

                <div className="price-chip">
                  Monthly <b>₹{item.prices.monthly}</b>
                </div>

                <div className="price-chip">
                  6 Days (Mon–Sat) <b>₹{item.prices.weekly6}</b>
                </div>

                <div className="price-chip">
                  3 Days (MWF) <b>₹{item.prices.weekly3_MWF}</b>
                </div>

                <div className="price-chip">
                  3 Days (TTS) <b>₹{item.prices.weekly3_TTS}</b>
                </div>

                {/* NEW PACKS */}
                <div className="price-chip">
                  3 Days Pack <b>₹{item.prices.threeDays}</b>
                </div>

                <div className="price-chip">
                  7 Days Pack <b>₹{item.prices.sevenDays}</b>
                </div>

                <div className="price-chip">
                  30 Days Pack <b>₹{item.prices.thirtyDays}</b>
                </div>
              </div>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              className="food-order-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleOrder(item);
              }}
            >
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
