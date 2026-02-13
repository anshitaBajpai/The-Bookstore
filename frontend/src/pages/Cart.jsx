import { useContext } from "react";
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      <div className={styles.header}>
        <h2 className={styles.heading}>🛒 Your Cart</h2>
        <p className={styles.itemCount}>
          {totalItems} {totalItems === 1 ? "item" : "items"} in cart
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.cartSection}>
          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <div key={item.id || item._id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemAuthor}>✍️ {item.author}</p>
                  <p className={styles.itemPrice}>
                    ₹{item.price.toFixed(2)} per item
                  </p>
                </div>

                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => decreaseQuantity(item.id || item._id)}
                    title="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={item.quantity}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={() => increaseQuantity(item.id || item._id)}
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  <p className={styles.subtotal}>₹{itemTotal.toFixed(2)}</p>
                </div>

                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id || item._id)}
                  title="Remove from cart"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>

            <div className={styles.summaryRow}>
              <span>
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <span className={styles.amount}>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.amount}>FREE</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span className={styles.totalAmount}>
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
              🛍️ Place Order
            </button>

            <button
              className={styles.continueShoppingBtn}
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
