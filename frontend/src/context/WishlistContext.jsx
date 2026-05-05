import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config.js";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/wishlist`)
      .then((res) => setWishlist(res.data))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  }, []);

  const getBookId = (book) => book.id || book._id;

  const addToWishlist = async (book) => {
    const bookId = getBookId(book);
    if (wishlist.find((item) => getBookId(item) === bookId)) return;
    setWishlist((prev) => [...prev, book]);
    try {
      await axios.post(`${API_URL}/wishlist/${bookId}`);
    } catch {
      setWishlist((prev) => prev.filter((item) => getBookId(item) !== bookId));
    }
  };

  const removeFromWishlist = async (id) => {
    const removed = wishlist.find((item) => getBookId(item) === id);
    setWishlist((prev) => prev.filter((item) => getBookId(item) !== id));
    try {
      await axios.delete(`${API_URL}/wishlist/${id}`);
    } catch {
      if (removed) setWishlist((prev) => [...prev, removed]);
    }
  };

  const isInWishlist = (id) => wishlist.some((item) => getBookId(item) === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
