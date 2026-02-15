import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";

// 🔹 Status color helper
const getStatusColor = (status) => {
  if (status === "PLACED") return "#facc15";
  if (status === "SHIPPED") return "#38bdf8";
  if (status === "DELIVERED") return "#22c55e";
  return "#ffffff";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📦 Your Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>You haven’t placed any orders yet.</div>
      ) : (
        <div className={styles.container}>
          {orders.map((order) => (
            <div key={order._id} className={styles.card}>
              {/* Header */}
              <div className={styles.header}>
                <span className={styles.orderId}>
                  Order ID: {order._id.slice(-6)}
                </span>
                <span className={styles.date}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Status */}
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Status:</span>
                <span
                  className={styles.status}
                  style={{ background: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className={styles.itemsList}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.item}>
                    <img
                      src={item.image || "/placeholder-book.png"}
                      alt={item.title}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemAuthor}>✍️ {item.author}</span>
                      <span className={styles.itemPrice}>
                        {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total:</span>
                <span className={styles.totalAmount}>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
