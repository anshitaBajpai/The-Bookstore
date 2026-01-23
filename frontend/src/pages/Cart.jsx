import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmptyCart from "../components/EmptyCart.jsx";
import styles from "./Cart.module.css";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/orders",
        { cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      clearCart();
      navigate("/orders");
    } catch (err) {
      alert("❌ Failed to place order");
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>🛒 Your Cart</h2>

      <div className={styles.cartContainer}>
        {cart.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.bookInfo}>
              <img src={item.image} alt={item.title} />
              <div>
                <h4>{item.title}</h4>
                <p>₹{item.price}</p>
              </div>
            </div>

            <div className={styles.quantity}>
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>

            <button
              className={styles.removeBtn}
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <h3>Total: ₹{totalPrice}</h3>
        <button className={styles.orderBtn} onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Cart;
