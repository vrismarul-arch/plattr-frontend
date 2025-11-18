import React from "react";
import { useCart } from "../../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import "./CartPage.css";
import empty from './empty.png'
const CartPage = () => {
  const {
    cartItems,
    loading: cartLoading,              // initial load
    isUpdating,                        // NEW: for any cart mutation
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    updateCartItemPriceOption,
  } = useCart();

  const navigate = useNavigate();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.selectedOptionPrice || item.prices.oneTime) * item.quantity,
    0
  );

  // Show full loader during initial load OR any update
  if (cartLoading || isUpdating) {
    return (
      <div className="cart-full-loader">
        <div className="loader-spinner"></div>
        <p>Updating your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <img
          src={empty}
          alt="empty cart"
        />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet</p>
        <Link to="/" className="explore-btn">
          Explore Menu
        </Link>
      </div>
    );
  }

  const handleQty = (id, delta) => {
    const item = cartItems.find((i) => i.productId === id);
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    updateCartItemQuantity(id, newQty);
    toast.success(delta > 0 ? "Added one more!" : "Removed one");
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handlePlanChange = (id, option) => {
    const priceMap = {
      oneTime: "oneTime",
      threeDays: "threeDays",
      sevenDays: "sevenDays",
      thirtyDays: "thirtyDays",
    };
    const price = item.prices[priceMap[option]];
    updateCartItemPriceOption(id, option, price);
  };

  return (
    <div className="zomato-cart-container">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />

      {/* Header */}
      <header className="cart-header">
        <Link to="/" className="back-link">
          <ArrowLeftOutlined style={{ marginRight: "5px" }} />
        </Link>
        <h1>My Cart ({cartItems.length})</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          <DeleteOutlined style={{ marginRight: "5px" }} />
          Clear Cart
        </button>
      </header>

      <div className="cart-body">
        {/* Cart Items */}
        <div className="items-list">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.img} alt={item.name} className="item-image" />

              <div className="item-details">
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="remove-btn"
                    disabled={isUpdating}
                  >
                    ×
                  </button>
                </div>

                <p className="item-desc">{item.desc}</p>

                {/* Plan Selector */}
                <select
                  className="plan-select"
                  value={item.selectedOption || "oneTime"}
                  onChange={(e) =>
                    updateCartItemPriceOption(item.productId, e.target.value)
                  }
                  disabled={isUpdating}
                >
                  <option value="oneTime">One-Time – ₹{item.prices.oneTime}</option>
                  <option value="threeDays">3 Days – ₹{item.prices.threeDays}</option>
                  <option value="sevenDays">7 Days – ₹{item.prices.sevenDays}</option>
                  <option value="thirtyDays">30 Days – ₹{item.prices.thirtyDays}</option>
                </select>

                {/* Quantity & Price */}
                <div className="item-footer">
                  <div className="quantity-box">
                    <button onClick={() => handleQty(item.productId, -1)} disabled={isUpdating}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQty(item.productId, 1)} disabled={isUpdating}>
                      +
                    </button>
                  </div>

                  <div className="item-total-price">
                    ₹{(item.selectedOptionPrice || item.prices.oneTime) * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Summary */}
        <div className="bill-summary">
          <h3>Bill Details</h3>

          <div className="bill-row delivery-row">
            <span>Delivery Fee</span>
            <span className="free">FREE</span>
          </div>

          <div className="bill-total">
            <strong>To Pay</strong>
            <strong>₹{totalAmount}</strong>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="checkout-button"
            disabled={isUpdating}
          >
            {isUpdating ? "Please wait..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;