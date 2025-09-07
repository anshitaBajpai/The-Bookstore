import React from "react";
import Navbar from "./Navbar";

const Header = () => (
  <header style={{
    background: "#0a2342",
    color: "#fff",
    padding: "16px 0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    marginBottom: "24px"
  }}>
    <Navbar />
    <h1 style={{ textAlign: "center", margin: 0, fontWeight: 700, fontSize: "2rem" }}>
      📚 Bookstore
    </h1>
  </header>
);

export default Header;
