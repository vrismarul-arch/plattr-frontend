import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api.jsx";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Helper for safe price retrieval
const getPriceSafely = (prices, optionKey, defaultKey = "oneTime") => {
  if (prices && prices[optionKey] !== undefined) return prices[optionKey];
  if (prices && prices[defaultKey] !== undefined) return prices[defaultKey];
  return 0;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if user is logged in
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || null; // null if not logged in

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        setCartItems([]); // guest: empty cart
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/cart?userId=${userId}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId]);

  const performUpdate = async (optimisticUpdate, apiCall) => {
    setIsUpdating(true);
    const previousState = cartItems;
    optimisticUpdate();
    try {
      if (userId) await apiCall(); // only call API if logged in
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      setCartItems(previousState);
    } finally {
      setIsUpdating(false);
    }
  };

  const addToCart = async (product, optionKey = "oneTime") => {
    const price = getPriceSafely(product.prices, optionKey);

    performUpdate(
      () => {
        setCartItems((prev) => {
          const exists = prev.find(
            (i) => i.productId === product._id && i.selectedOption === optionKey
          );
          if (exists) {
            return prev.map((i) =>
              i.productId === product._id && i.selectedOption === optionKey
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          }
          return [
            ...prev,
            {
              ...product,
              productId: product._id,
              selectedOption: optionKey,
              selectedOptionPrice: price,
              quantity: 1,
            },
          ];
        });
        toast.success("Added to cart");
      },
      () =>
        api.post("/cart/add", {
          userId,
          product,
          optionKey,
        })
    );
  };

  const removeFromCart = async (_id) => {
    performUpdate(
      () => setCartItems((prev) => prev.filter((i) => i._id !== _id)),
      () => api.post("/cart/remove", { userId, _id })
    );
  };

  const clearCart = async () => {
    performUpdate(
      () => setCartItems([]),
      () => api.post("/cart/clear", { userId })
    );
  };

  const updateCartItemQuantity = async (_id, quantity) => {
    if (quantity < 1) return removeFromCart(_id);

    performUpdate(
      () =>
        setCartItems((prev) =>
          prev.map((i) => (i._id === _id ? { ...i, quantity } : i))
        ),
      () => api.post("/cart/update", { userId, _id, quantity })
    );
  };

  const updateCartItemPriceOption = async (_id, optionKey) => {
    const item = cartItems.find((i) => i._id === _id);
    const newPrice = getPriceSafely(item?.prices, optionKey);

    if (!item || newPrice === undefined) return;

    performUpdate(
      () =>
        setCartItems((prev) =>
          prev.map((i) =>
            i._id === _id
              ? { ...i, selectedOption: optionKey, selectedOptionPrice: newPrice }
              : i
          )
        ),
      () => api.post("/cart/update", { userId, _id, selectedOption: optionKey })
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
        userLoggedIn: !!userId, // new flag for UI logic
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
