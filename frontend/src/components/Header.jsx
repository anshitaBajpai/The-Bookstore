import React from "react";
import Navbar from "./Navbar";

const Header = () => (
  <header
    style={{
  background: "#134e4a",
      color: "#fff",
      padding: "24px 0 10px 0",
      boxShadow: "0 6px 24px #134e4a55",
      marginBottom: "32px",
  borderRadius: "0",
      borderBottom: "4px solid #43c6ac",
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)",
      position: "relative",
      zIndex: 2
    }}
  >
    <Navbar />
  </header>
);

export default Header;
