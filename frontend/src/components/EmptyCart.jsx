import styles from "./styles/EmptyCart.module.css";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.icon}>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven’t added anything to your cart yet.</p>

        <Link to="/" className={styles.button}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
