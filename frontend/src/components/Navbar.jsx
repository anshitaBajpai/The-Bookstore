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
    window.location.href = "/auth";
  };

  const linkStyle = {
    color: "#a3bffa",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1.05rem",
    transition: "color 0.2s",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "linear-gradient(90deg, #232946, #1a223f)",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        borderBottom: "1px solid #3b4a6b",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: "#7fffd4",
          fontWeight: 800,
          fontSize: "1.8rem",
          letterSpacing: "1px",
          textDecoration: "none",
        }}
      >
        📚 The BookStore
      </Link>

      {/* Navigation */}
      <div style={{ display: "flex", gap: "26px", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>

        {username && (
          <Link to="/orders" style={linkStyle}>
            My Orders
          </Link>
        )}

        <Link to="/cart" style={linkStyle}>
          Cart{" "}
          {cartCount > 0 && (
            <span
              style={{
                background: "#7fffd4",
                color: "#232946",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: 700,
                marginLeft: "6px",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>

        {!username ? (
          <Link to="/auth" style={linkStyle}>
            Login
          </Link>
        ) : (
          <>
            <span
              style={{
                color: "#7fffd4",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Hi, {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>

            {role === "admin" && (
              <Link to="/admin" style={linkStyle}>
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1.5px solid #7fffd4",
                color: "#7fffd4",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#7fffd4";
                e.currentTarget.style.color = "#232946";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#7fffd4";
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
