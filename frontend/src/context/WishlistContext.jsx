import React, { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const getBookId = (book) => book.id || book._id;

  const addToWishlist = (book) => {
    if (!wishlist.find((item) => getBookId(item) === getBookId(book))) {
      setWishlist([...wishlist, book]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => getBookId(item) !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => getBookId(item) === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
