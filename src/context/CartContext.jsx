import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.jsx";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    api
      .get("/cart") // ✅ token-based, no userId
      .then((res) => {
        setCartItems(res.data.items || []);
      })
      .catch(() => {
        toast.error("Failed to load cart");
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* ================= ADD TO CART ================= */
  const addToCart = async (
    product,
    selectedOption = "oneTime",
    selectedIngredients = []
  ) => {
    try {
      const payloadIngredients = (Array.isArray(selectedIngredients)
        ? selectedIngredients
        : []
      ).map((ing) => ({
        ingredientId: ing._id,
        name: ing.name,
        quantity: ing.quantity,
      }));

      const res = await api.post("/cart/add", {
        productId: product._id,        // ✅ send ID only
        selectedOption,                // ✅ correct key
        selectedIngredients: payloadIngredients,
        quantity: 1,
      });

      setCartItems(res.data.items);
   
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = async (_id) => {
    setIsUpdating(true);
    try {
      const res = await api.post("/cart/remove", { _id });
      setCartItems(res.data.items);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    setIsUpdating(true);
    try {
      const res = await api.post("/cart/clear");
      setCartItems(res.data.items);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ================= UPDATE QTY ================= */
  const updateCartItemQuantity = async (_id, quantity) => {
    if (quantity < 1) return;

    setIsUpdating(true);
    try {
      const res = await api.post("/cart/update", {
        _id,
        quantity,
      });
      setCartItems(res.data.items);
    } finally {
      setIsUpdating(false);
    }
  };

  /* ================= UPDATE PLAN ================= */
  const updateCartItemPriceOption = async (_id, selectedOption) => {
    setIsUpdating(true);
    try {
      const res = await api.post("/cart/update", {
        _id,
        selectedOption,
      });
      setCartItems(res.data.items);
    } finally {
      setIsUpdating(false);
    }
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
