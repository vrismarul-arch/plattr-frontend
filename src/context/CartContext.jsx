import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.jsx";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "guest";

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart?userId=${userId}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Add to Cart
  const addToCart = async (product, optionKey = "oneTime") => {
    try {
      await api.post("/cart/add", { userId, product });
      setCartItems((prev) => {
        const exists = prev.find((item) => item.productId === product._id);
        if (exists) {
          return prev.map((item) =>
            item.productId === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [
          ...prev,
          {
            ...product,
            productId: product._id,
            quantity: 1,
            selectedOption: optionKey,
            selectedOptionPrice: product.prices[optionKey],
          },
        ];
      });
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // Remove item
  const removeFromCart = async (id) => {
    try {
      await api.post("/cart/remove", { userId, productId: id });
      setCartItems((prev) => prev.filter((item) => item.productId !== id));
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await api.post("/cart/clear", { userId });
      setCartItems([]);
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  // Update quantity
  const updateCartItemQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.post("/cart/update", { userId, productId: id, quantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Quantity update error:", err);
    }
  };

  // Update option
  const updateCartItemPriceOption = async (id, optionKey) => {
    try {
      await api.post("/cart/update", { userId, productId: id, selectedOption: optionKey });
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === id
            ? {
                ...item,
                selectedOption: optionKey,
                selectedOptionPrice: item.prices[optionKey],
              }
            : item
        )
      );
    } catch (err) {
      console.error("Option update error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        updateCartItemPriceOption,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
