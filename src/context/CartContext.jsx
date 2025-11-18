import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.jsx";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);        // Initial load
  const [isUpdating, setIsUpdating] = useState(false); // For any cart changes
  const userId = "guest"; // Replace with real user ID later

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cart?userId=${userId}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast.error("Could not load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Helper to handle loading state + error rollback
  const performUpdate = async (optimisticUpdate, apiCall) => {
    setIsUpdating(true);
    const previousState = cartItems;

    // Apply optimistic UI
    optimisticUpdate();

    try {
      await apiCall();
    } catch (err) {
      console.error("Cart update failed:", err);
      toast.error("Update failed, try again");
      setCartItems(previousState); // Rollback
    } finally {
      setIsUpdating(false);
    }
  };

  // Add to Cart
  const addToCart = async (product, optionKey = "oneTime") => {
    const price = product.prices[optionKey];

    performUpdate(
      () => {
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
              selectedOptionPrice: price,
            },
          ];
        });
        toast.success("Added to cart!");
      },
      () => api.post("/cart/add", { userId, product: { ...product, optionKey } })
    );
  };

  // Remove from Cart
  const removeFromCart = async (productId) => {
    performUpdate(
      () => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        toast.success("Removed from cart");
      },
      () => api.post("/cart/remove", { userId, productId })
    );
  };

  // Clear Cart
  const clearCart = async () => {
    performUpdate(
      () => {
        setCartItems([]);
        toast.success("Cart cleared");
      },
      () => api.post("/cart/clear", { userId })
    );
  };

  // Update Quantity
  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    performUpdate(
      () => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
        toast.success("Quantity updated");
      },
      () => api.post("/cart/update", { userId, productId, quantity })
    );
  };

  // Update Selected Plan (oneTime, threeDays, etc.)
  const updateCartItemPriceOption = async (productId, optionKey) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    const newPrice = item.prices[optionKey];

    performUpdate(
      () => {
        setCartItems((prev) =>
          prev.map((i) =>
            i.productId === productId
              ? {
                  ...i,
                  selectedOption: optionKey,
                  selectedOptionPrice: newPrice,
                }
              : i
          )
        );
        toast.success("Plan changed");
      },
      () =>
        api.post("/cart/update", {
          userId,
          productId,
          selectedOption: optionKey,
        })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        isUpdating,
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