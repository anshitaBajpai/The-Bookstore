import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const getBookId = (book) => book.id || book._id;

  const addToCart = (book) => {
    const bookId = getBookId(book);

    setCart((prev) => {
      const existing = prev.find((item) => getBookId(item) === bookId);

      if (Number(book.stock) === 0) {
        alert("❌ This book is out of stock.");
        return prev;
      }

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

      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => getBookId(item) !== id));
  };

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

  // 🔐 Persist cart data across page refresh using localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
