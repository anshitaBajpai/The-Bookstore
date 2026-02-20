import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { WishlistProvider } from "./context/WishlistContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </Router>
  </React.StrictMode>,
);
