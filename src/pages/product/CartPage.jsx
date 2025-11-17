import React from "react";
import { useCart } from "../../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast
import "./CartPage.css";

const CartPage = () => {
  const {
    cartItems,
    loading,
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

  if (loading) return <p className="loading-text">Loading cart...</p>;
  if (!cartItems.length) return <p className="empty-cart">Your cart is empty.</p>;

  // Handlers with toast
  const handleRemove = (productId) => {
    removeFromCart(productId);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
    toast.success("Quantity updated");
  };

  const handlePriceOptionChange = (productId, option) => {
    updateCartItemPriceOption(productId, option);
    toast.success("Option updated");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page-container">
      {/* Hot toaster container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="cart-header">
        <Link to="/" className="back-link">← Continue Shopping</Link>
        <h1>Your Cart</h1>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item-card" key={item.productId}>
            <div className="item-image">
              <img src={item.img} alt={item.name} />
            </div>

            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-desc">{item.desc}</p>

              <div className="item-options">
                <select
                  value={item.selectedOption || "oneTime"}
                  onChange={(e) => handlePriceOptionChange(item.productId, e.target.value)}
                  className="item-select"
                >
                  <option value="oneTime">One-Time</option>
                  <option value="threeDays">3 Days</option>
                  <option value="sevenDays">7 Days</option>
                  <option value="thirtyDays">30 Days</option>
                </select>

                <div className="item-quantity">
                  <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                </div>

                <span className="item-price">
                  ₹{(item.selectedOptionPrice || item.prices.oneTime) * item.quantity}
                </span>
              </div>

              <button className="btn-remove" onClick={() => handleRemove(item.productId)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{totalAmount}</h3>
        <div className="cart-summary-buttons">
          <button className="btn-checkout" onClick={handleCheckout}>Checkout</button>
          <button className="btn-clear" onClick={handleClearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
