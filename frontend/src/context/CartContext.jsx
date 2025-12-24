import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Handle id / _id mismatch
  const getBookId = (book) => book.id || book._id;

  // ✅ ADD TO CART (FIXED)
  const addToCart = (book) => {
    const bookId = getBookId(book);

    setCart((prev) => {
      const existing = prev.find((item) => getBookId(item) === bookId);

      // 🚫 Out of stock
      if (Number(book.stock) === 0) {
        alert("❌ This book is out of stock.");
        return prev;
      }

      // 🚫 Stock limit reached
      if (existing) {
        if (existing.quantity >= book.stock) {
          alert("❌ Cannot add more. Stock limit reached.");
          return prev;
        }

        return prev.map((item) =>
          getBookId(item) === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ✅ Add new item
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  // ✅ Remove item completely
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => getBookId(item) !== id));
  };

  // ✅ Increase quantity (with stock check)
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (getBookId(item) === id) {
          if (item.quantity >= item.stock) {
            alert("❌ Stock limit reached.");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  // ✅ Decrease quantity (remove if 0)
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          getBookId(item) === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
