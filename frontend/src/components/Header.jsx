import React from "react";
import Navbar from "./Navbar";

const Header = () => (
  <header
    style={{
      background: "linear-gradient(90deg, #e0ffef 0%, #43c6ac 100%)",
      color: "#134e4a",
      padding: "20px 0 8px 0",
      boxShadow: "0 4px 18px #43c6ac33",
      marginBottom: "28px",
      borderRadius: "0 0 24px 24px",
      borderBottom: "3px solid #43c6ac"
    }}
  >
    <Navbar />
  </header>
);

export default Header;
