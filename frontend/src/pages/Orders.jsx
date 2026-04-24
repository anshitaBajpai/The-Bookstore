import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./Orders.module.css";
import { API_URL } from "../config.js";

const getStatusColor = (status) => {
  if (status === "PLACED")    return "#facc15";
  if (status === "SHIPPED")   return "#38bdf8";
  if (status === "DELIVERED") return "#22c55e";
  if (status === "CANCELLED") return "#f87171";
  return "#e5e7eb";
};

const getPaymentStatusColor = (status) => {
  if (status === "PAID") return "#bbf7d0";
  if (status === "CANCELLED") return "#fecaca";
  return "#fde68a";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await axios.put(`${API_URL}/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data : o))
      );
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📦 Your Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>You haven't placed any orders yet.</div>
      ) : (
        <div className={styles.container}>
          {orders.map((order) => (
            <div
              key={order._id}
              className={`${styles.card} ${order.status === "CANCELLED" ? styles.cardCancelled : ""}`}
            >
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.orderId}>Order ID: {order._id.slice(-6)}</span>
                <span className={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>

              {/* Status row */}
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Status:</span>
                <span
                  className={styles.status}
                  style={{ background: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
                <span className={styles.statusLabel}>Payment:</span>
                <span
                  className={styles.status}
                  style={{ background: getPaymentStatusColor(order.paymentStatus || "PENDING") }}
                >
                  {(order.paymentMethod || "COD")} • {(order.paymentStatus || "PENDING")}
                </span>

                {order.status === "PLACED" && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancel(order._id)}
                    disabled={cancellingId === order._id}
                  >
                    {cancellingId === order._id ? "Cancelling…" : "Cancel Order"}
                  </button>
                )}
              </div>

              {/* Items */}
              {order.items.map((item, index) => (
                <div key={index} className={styles.item}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemPrice}>{item.quantity} × ₹{item.price}</span>
                  {order.status === "DELIVERED" && (
                    <Link to={`/books/${item.bookId}`} className={styles.reviewLink}>
                      Write a Review
                    </Link>
                  )}
                </div>
              ))}

              {/* Total */}
              <div className={styles.total}>Total: ₹{order.totalAmount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
