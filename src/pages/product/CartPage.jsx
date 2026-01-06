import React from "react";
import { useCart } from "../../context/CartContext.jsx"; 
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import empty from './empty.png'; 
import "./CartPage.css"; 

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
  
  // --- Price calculation helper function ---
  const getItemPrice = (item) => {
    if (item.selectedOptionPrice !== undefined) {
      return item.selectedOptionPrice;
    }
    if (item.prices?.oneTime !== undefined) {
      return item.prices.oneTime;
    }
    return 0;
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="cart-full-loader">
        <div className="loader-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="empty-state">
        <img src={empty} alt="empty cart" />
        <h2>Your cart is empty</h2>
        <Link to="/" className="explore-btn">Explore Menu</Link>
      </div>
    );
  }

  const getItemTotalPrice = (item) =>
    (getItemPrice(item) * item.quantity).toFixed(2);

  const getOptionPrice = (item) => getItemPrice(item).toFixed(2);

  return (
    <div className="zomato-cart-container">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />

      <header className="cart-header">
        <Link to="/" className="back-link">
          <ArrowLeftOutlined style={{ marginRight: "5px" }} />
        </Link>
        <h1>My Cart ({cartItems.length})</h1>
    <button
      onClick={clearCart}
      className="clear-cart-btn"
      disabled={isUpdating}
    >
      <DeleteOutlined style={{ marginRight: "5px" }} />
      Clear Cart
    </button>
      </header>

      <div className="cart-body">
        <div className="items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.img} alt={item.name} className="item-image" />
              <div className="item-details">
                
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                    disabled={isUpdating}
                  >
                    ×
                  </button>
                </div>

                <p className="item-desc">{item.desc}</p>

                {!item.deliverable && (
                  <p className="item-note">⚠️ Not deliverable on Sunday</p>
                )}

                <p className="item-current-price">
                  Plan Price: ₹{getOptionPrice(item)}
                </p>

                {/* FIXED SELECT: NO OBJECT RENDERING */}
                <select
                  className="plan-select"
                  value={item.selectedOption || "oneTime"}
                  onChange={(e) =>
                    updateCartItemPriceOption(item._id, e.target.value)
                  }
                  disabled={isUpdating}
                >
                  {/* One-time */}
                  {item.prices?.oneTime !== undefined && (
                    <option value="oneTime">
                      One-Time – ₹{item.prices.oneTime}
                    </option>
                  )}

                  {/* Monthly */}
                  {item.prices?.monthly !== undefined && (
                    <option value="monthly">
                      Monthly – ₹{item.prices.monthly}
                    </option>
                  )}

                  {/* Weekly 3 days */}
                  {item.prices?.weekly3?.monWedFri !== undefined && (
                    <option value="weekly3_monWedFri">
                      Mon–Wed–Fri – ₹{item.prices.weekly3.monWedFri}
                    </option>
                  )}

                  {item.prices?.weekly3?.tueThuSat !== undefined && (
                    <option value="weekly3_tueThuSat">
                      Tue–Thu–Sat – ₹{item.prices.weekly3.tueThuSat}
                    </option>
                  )}

                  {/* Weekly 6 days */}
                  {item.prices?.weekly6?.monToSat !== undefined && (
                    <option value="weekly6_monToSat">
                      Mon–Sat – ₹{item.prices.weekly6.monToSat}
                    </option>
                  )}
                </select>

                <div className="item-footer">
                  <div className="quantity-box">
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item._id, item.quantity - 1)
                      }
                      disabled={isUpdating}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartItemQuantity(item._id, item.quantity + 1)
                      }
                      disabled={isUpdating}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total-price">
                    ₹{getItemTotalPrice(item)}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="bill-summary">
          <h3>Bill Details</h3>

          <div className="bill-row subtotal-row">
            <span>Subtotal (before delivery)</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <div className="bill-row delivery-row">
            <span>Delivery Fee</span>
            <span className="free">FREE</span>
          </div>

          <div className="bill-total">
            <strong>To Pay</strong>
            <strong>₹{totalAmount.toFixed(2)}</strong>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="checkout-button"
            disabled={isUpdating || !cartItems.length}
          >
            {isUpdating ? "Updating Cart..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>

      {isUpdating && (
        <div className="cart-full-loader overlay">
          <div className="loader-spinner"></div>
          <p>Updating cart details...</p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
