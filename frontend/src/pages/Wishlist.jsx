import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  if (wishlist.length === 0) {
    return <h2 style={{ textAlign: "center" }}>Your wishlist is empty 💔</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Wishlist ❤️</h2>

      {wishlist.map((book) => (
        <div key={book.id} style={{ marginBottom: "20px" }}>
          <Link to={`/books/${book.id}`}>
            <h3>{book.title}</h3>
          </Link>

          <button onClick={() => removeFromWishlist(book.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;
