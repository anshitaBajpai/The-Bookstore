import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import styles from "./styles/Navbar.module.css";

function Navbar() {
  const { cart } = useContext(CartContext);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link to="/" className={styles.logo}>
        📚 The BookStore
      </Link>

      {/* Navigation */}
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          Home
        </Link>

        {username && (
          <Link to="/orders" className={styles.link}>
            My Orders
          </Link>
        )}

        <Link to="/cart" className={styles.link}>
          Cart
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </Link>

        {!username ? (
          <Link to="/auth" className={styles.link}>
            Login
          </Link>
        ) : (
          <>
            <span className={styles.username}>
              Hi, {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>

            {role === "admin" && (
              <Link to="/admin" className={styles.link}>
                Admin
              </Link>
            )}

            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
