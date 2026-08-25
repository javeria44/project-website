import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
const STORAGE_KEY = "shaharyar_cart_v1";

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function lineTotal(item) {
  const base = item.packageSelected ? item.packagePrice : item.pricePerSqm * item.sqm;
  return Math.round(base * item.quantity * 100) / 100;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // cartKey identifies a distinct line: same service + same package/sqm mode
  const addToCart = (newItem) => {
    setItems((prev) => {
      const cartKey = `${newItem.slug}:${newItem.packageSelected ? "package" : newItem.sqm}`;
      const existingIndex = prev.findIndex(
        (i) => `${i.slug}:${i.packageSelected ? "package" : i.sqm}` === cartKey
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, { ...newItem, cartKey }];
    });
    toast.success(`${newItem.title} added to cart`);
  };

  const removeFromCart = (cartKey) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i)));
  };

  const updateSqm = (cartKey, sqm) => {
    if (sqm < 1) return;
    setItems((prev) => prev.map((i) => (i.cartKey === cartKey ? { ...i, sqm } : i)));
  };

  const togglePackage = (cartKey, packageSelected) => {
    setItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, packageSelected } : i))
    );
  };

  const clearCart = () => setItems([]);

  const itemsWithTotals = useMemo(
    () => items.map((i) => ({ ...i, lineTotal: lineTotal(i) })),
    [items]
  );

  const cartTotal = useMemo(
    () => Math.round(itemsWithTotals.reduce((sum, i) => sum + i.lineTotal, 0) * 100) / 100,
    [itemsWithTotals]
  );

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = {
    items: itemsWithTotals,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSqm,
    togglePackage,
    clearCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
