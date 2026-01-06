import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import api from "../../api/api.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen.jsx";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // ⭐ collapse state
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

          // PRICE STRUCTURE
          prices: {
            oneTime: item.prices?.oneTime || 0,
            monthly: item.prices?.monthly || 0,
            weekly3_MWF: item.prices?.weekly3?.monWedFri || 0,
            weekly3_TTS: item.prices?.weekly3?.tueThuSat || 0,
            weekly6: item.prices?.weekly6?.monToSat || 0,

            threeDays: item.prices?.threeDays || 0,
            sevenDays: item.prices?.sevenDays || 0,
            thirtyDays: item.prices?.thirtyDays || 0,
          },

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
  // LOADING
  // ================================
  if (loading) return <LoadingScreen text="Loading meals..." />;

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
          onClick={() => navigate(`/product/${item._id}`)}
          >
            {/* IMAGE */}
            <div className="food-image-wrap">
              <img src={item.img} alt={item.name} className="food-image" />
            </div>

            {/* DETAILS */}
            <div className="food-details">              <div className="food-rating-badge">⭐ {item.rating}</div>

              <h3 className="food-title">{item.name}</h3>
              <p className="food-desc">{item.desc}</p>

              {item.totalQuantity && (
                <p className="food-qty">
                  <b>Quantity:</b> {item.totalQuantity}
                </p>
              )}

              {/* INGREDIENT LIST */}
              {/* {item.ingredients.length > 0 && (
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
              )} */}

              {/* ===========================
                    COLLAPSIBLE PRICE PLANS
                ============================ */}
              {/* <div className="price-collapse">
                <div
                  className="price-collapse-header"
                  onClick={() =>
                    setExpanded(expanded === item._id ? null : item._id)
                  }
                >
                  <span>Price Plans</span>
                  <span className="arrow">
                    {expanded === item._id ? "▲" : "▼"}
                  </span>
                </div>

                {expanded === item._id && (
                  <div className="price-collapse-content">
                    <div className="price-row">
                      <span>One Time</span>
                      <b>₹{item.prices.oneTime}</b>
                    </div>

                    <div className="price-row">
                      <span>Monthly</span>
                      <b>₹{item.prices.monthly}</b>
                    </div>

                    <div className="price-subtitle">Weekly 3 Days</div>

                    <div className="price-row">
                      <span>Mon–Wed–Fri</span>
                      <b>₹{item.prices.weekly3_MWF}</b>
                    </div>

                    <div className="price-row">
                      <span>Tue–Thu–Sat</span>
                      <b>₹{item.prices.weekly3_TTS}</b>
                    </div>

                    <div className="price-subtitle">Weekly 6 Days</div>
                    <div className="price-row">
                      <span>Mon–Sat</span>
                      <b>₹{item.prices.weekly6}</b>
                    </div>


                  </div>
                )}
              </div> */}
            </div>

            {/* ADD TO CART */}
            {/* <button
              className="food-order-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleOrder(item);
              }}
            >
              Add to Cart
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
