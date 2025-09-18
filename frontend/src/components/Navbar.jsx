import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

function Navbar() {
  const { cart } = useContext(CartContext);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Get user info from localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // redirect after logout
  };

  return (
    <nav
      style={{
        padding: "18px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2 style={{ color: "#a3bffa", fontWeight: 700, fontSize: "1.7rem", letterSpacing: 1 }}>The BookStore</h2>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        <Link to="/" style={{ color: "#a3bffa", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
          Home
        </Link>

        {!username ? (
          <Link to="/login" style={{ color: "#a3bffa", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
            Login
          </Link>
        ) : (
          <>
            <span style={{ color: "#7fffd4", fontWeight: 600 }}>Hi, {username}</span>
            {role === "admin" && (
              <Link to="/admin" style={{ color: "#a3bffa", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleLogout} style={{ background: "transparent", color: "#ff7f7f", border: "none", cursor: "pointer" }}>
              Logout
            </button>
          </>
        )}

        <Link to="/cart" style={{ color: "#a3bffa", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
          Cart {cartCount > 0 && <span style={{ color: "#7fffd4" }}>({cartCount})</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
