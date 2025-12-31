import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

function Navbar() {
  const { cart } = useContext(CartContext);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth"; // redirect to AuthPage
  };

  return (
    <nav
      style={{
        padding: "18px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "#a3bffa", fontWeight: 700, fontSize: "1.7rem" }}>
        The BookStore
      </h2>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {username && (
          <>
            <Link
              to="/"
              style={{
                color: "#a3bffa",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Home
            </Link>
            <Link
              to="/cart"
              style={{
                color: "#a3bffa",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Cart{" "}
              {cartCount > 0 && (
                <span style={{ color: "#7fffd4" }}>({cartCount})</span>
              )}
            </Link>
          </>
        )}

        {!username ? (
          <Link
            to="/auth"
            style={{
              color: "#a3bffa",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        ) : (
          <>
            <span
              style={{ color: "#7fffd4", fontWeight: 600, marginLeft: "18px" }}
            >
              Hi, {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>
            {role === "admin" && (
              <Link
                to="/admin"
                style={{
                  color: "#a3bffa",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/orders"
              style={{
                color: "#a3bffa",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#a3bffa",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
