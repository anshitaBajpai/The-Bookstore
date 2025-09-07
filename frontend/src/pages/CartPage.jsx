

import React, { useContext } from "react";
import CartContext from "../context/CartContext";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0) {
    return <h2 style={{ padding: "20px" }}>Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1> Your Cart</h1>
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 0",
            padding: "10px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        >
          <span>
            {item.title} (x{item.qty})
          </span>
          <span>₹{item.price * item.qty}</span>
          <button
            onClick={() => removeFromCart(item.id)}
            style={{
              marginLeft: "10px",
              padding: "6px 10px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
             Remove
          </button>
        </div>
      ))}
      <h2 style={{ marginTop: "20px" }}>Total: {total}</h2>

      <button
        onClick={clearCart}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          background: "#ffcc00",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Clear Cart
      </button>
    </div>
  );
}

export default CartPage;
