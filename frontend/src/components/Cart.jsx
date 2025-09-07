import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  if (cart.length === 0) {
    return <div style={{ padding: "20px", textAlign: "center" }}>🛒 Your cart is empty.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛒 Cart</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.map((item) => (
          <li key={item.id || item._id} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            background: "#f4f6fa",
            borderRadius: "8px",
            padding: "12px"
          }}>
            <img src={item.image} alt={item.title} style={{ width: 60, height: 80, objectFit: "cover", marginRight: 16 }} />
            <div style={{ flex: 1 }}>
              <strong>{item.title}</strong>
              <div>₹{item.price}</div>
              <div>Quantity: {item.quantity}</div>
            </div>
            <button onClick={() => decreaseQuantity(item.id || item._id)} style={{ marginRight: 8 }}>-</button>
            <button onClick={() => increaseQuantity(item.id || item._id)} style={{ marginRight: 8 }}>+</button>
            <button onClick={() => removeFromCart(item.id || item._id)} style={{ color: "red" }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
