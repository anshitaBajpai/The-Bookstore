import React, { useContext } from "react";
import CartContext from "../context/CartContext";
import styles from "./CartPage.module.css";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0) {
    return <h2 className={styles.empty}>Your cart is empty</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🛒 Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id} className={styles.item}>
          <span className={styles.title}>
            {item.title} (x{item.qty})
          </span>

          <span className={styles.price}>₹{item.price * item.qty}</span>

          <button
            onClick={() => removeFromCart(item.id)}
            className={styles.removeBtn}
          >
            Remove
          </button>
        </div>
      ))}

      <h2 className={styles.total}>Total: ₹{total}</h2>

      <button onClick={clearCart} className={styles.clearBtn}>
        Clear Cart
      </button>
    </div>
  );
}

export default CartPage;
