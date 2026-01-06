import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api.jsx";
import { useCart } from "../../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!product) return <p className="not-found">Product not found</p>;

  const handleAddToCart = () => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");
    addToCart(product);
    navigate("/cart");
  };

  const displayPrice = product.prices?.oneTime || 50;

  return (
    <>
      {/* ================= DESKTOP VERSION ================= */}
      <div className="pd-desktop-grid">
        <div className="pd-image-container">
          <img src={product.img} alt={product.name} className="pd-main-img" />
          <button className="pd-back-desktop" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="pd-content-pro">
          <div className="pd-header-pro">
            <h1 className="pd-title">{product.name}</h1>
            {product.totalQuantity ? (
              <span className="pd-stock-badge">
                {product.totalQuantity}
              </span>
            ) : (
              <span className="pd-out-badge">Out of Stock</span>
            )}
          </div>

          <p className="pd-desc">{product.desc}</p>

          {/* Pricing Cards */}
          <div className="pricing-grid-pro">
            <div className="price-box one-time">
              <span className="label">One Time Purchase</span><br />
              <span className="price">₹{product.prices?.oneTime}</span>
            </div>

            <div className="price-box monthly">
              <span className="label">Monthly Subscription</span><br />
              <span className="price">
                ₹{product.prices?.monthly}
                <small>/month</small>
              </span>
            </div>
          </div>

          {/* Weekly Plans */}
          <div className="weekly-plans">
            <h3>Choose Your Weekly Plan</h3>

            <div className="weekly-cards">

              {/* Mon–Wed–Fri */}
              <div className="weekly-card">
                <div>
                  <div className="days">Mon • Wed • Fri</div>
                  <div className="plan">3 Days / Week</div>
                  <div className="wprice">
                    ₹{product.prices?.weekly3?.monWedFri}
                  </div>
                </div>
              </div>

              {/* Tue–Thu–Sat */}
              <div className="weekly-card">
                <div>
                  <div className="days">Tue • Thu • Sat</div>
                  <div className="plan">3 Days / Week</div>
                  <div className="wprice">
                    ₹{product.prices?.weekly3?.tueThuSat}
                  </div>
                </div>
              </div>

              {/* 6 Days Plan */}
              <div className="weekly-card best-value">
                <div className="best-badge">BEST VALUE</div>
                <div>
                  <div className="days">Mon → Sat</div>
                  <div className="plan">6 Days / Week</div>
                  <div className="wprice highlight">
                    ₹{product.prices?.weekly6?.monToSat}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div className="ingredients-section">
              <h3>Fresh Ingredients Included</h3>
              <div className="ing-grid">
                {product.ingredients.map((ing) => (
                  <div key={ing._id} className="ing-item-pro">
                    <span className="ing-name">{ing.name}</span>
                    <span className="ing-amt">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop CTA */}
          <button className="desktop-cta" onClick={handleAddToCart}>
            <span>Add to Cart • ₹{product.prices?.oneTime}</span> →
          </button>
        </div>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="plattr-mobile">

        {/* Top Bar */}
        <div className="top-bar">
          <div className="back-arrow" onClick={() => navigate(-1)}>
            ←
          </div>
          <img src="/logo.png" alt="" className="logo" />
          <div className="right-icons">
            <div className="cart-icon">
              🛒 <span className="cart-count">0</span>
            </div>
            <div className="profile-icon">👤</div>
            <div className="profile-icon">👤</div>
          </div>
        </div>

        {/* Product Image */}
        <div className="product-image-container">
          <img src={product.img} alt={product.name} className="product-img" />
        </div>

        {/* Add to Cart */}
        <div className="add-to-cart-bar" onClick={handleAddToCart}>
          <div className="atc-text">
            Add to Cart <span className="price">₹{displayPrice}</span>
          </div>
          <div className="atc-arrow">→</div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-desc">{product.desc}</p>
        </div>

        {/* Full Content */}
        <div className="full-content">

          {/* Pricing */}
          <div className="pd-pricing-grid">
            <div className="price-card">
              <div className="price-label">One Time</div>
              <div className="price-value">₹{product.prices?.oneTime}</div>
            </div>

            <div className="price-card">
              <div className="price-label">Monthly Plan</div>
              <div className="price-value">
                ₹{product.prices?.monthly}
                <small>/month</small>
              </div>
            </div>
          </div>

          {/* Weekly Plans */}
          <div className="pd-weekly-section">
            <h3>Weekly Plans</h3>
            <div className="weekly-options">

              {/* Mon–Wed–Fri */}
              <div className="weekly-card">
                <div>
                  <div className="days">Mon • Wed • Fri</div>
                  <div className="plan-name">3 Days/Week</div>
                </div>
                <div className="price">
                  ₹{product.prices?.weekly3?.monWedFri}
                </div>
              </div>

              {/* Tue–Thu–Sat */}
              <div className="weekly-card">
                <div>
                  <div className="days">Tue • Thu • Sat</div>
                  <div className="plan-name">3 Days/Week</div>
                </div>
                <div className="price">
                  ₹{product.prices?.weekly3?.tueThuSat}
                </div>
              </div>

              {/* 6 Days Plan (CORRECTED LINE BELOW) */}
              <div className="weekly-card highlight">
                <div>
                  <div className="days">Mon → Sat</div>
                  <div className="plan-name">
                    6 Days/Week <span className="best-tag">BEST VALUE</span>
                  </div>
                </div>
                <div className="price">
                  {/* Accessing monToSat property to display the price */}
                  ₹{product.prices?.weekly6?.monToSat} 
                </div>
              </div>

            </div>
          </div>

          {/* Ingredients */}
          {product.ingredients?.length > 0 && (
            <div className="pd-ingredients-new">
              <h3>What's Inside</h3>
              <div className="ingredients-list">
                {product.ingredients.map((ing) => (
                  <div key={ing._id} className="ing-item">
                    <span>{ing.name}</span>
                    <span className="ing-qty">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ProductDetails;