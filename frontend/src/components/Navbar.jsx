import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import styles from "./Navbar.module.css";

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
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Home
        </NavLink>

        {username && (
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            My Orders
          </NavLink>
        )}

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Cart
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </NavLink>

        {!username ? (
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Login
          </NavLink>
        ) : (
          <>
            <span className={styles.username}>
              Hi, {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>

            {role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                Admin
              </NavLink>
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
