import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const getBookId = (book) => book.id || book._id;

  const addToCart = (book) => {
    const bookId = getBookId(book);
    setCart((prev) => {
      const existing = prev.find((item) => getBookId(item) === bookId);
      if (existing) {
        return prev.map((item) =>
          getBookId(item) === bookId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => getBookId(item) !== id));
  const increaseQuantity = (id) =>
    setCart((prev) =>
      prev.map((item) => (getBookId(item) === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  const decreaseQuantity = (id) =>
    setCart((prev) =>
      prev
        .map((item) => (getBookId(item) === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
