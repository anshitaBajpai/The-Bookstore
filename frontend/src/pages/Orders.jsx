import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Your Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <p>Order ID: {order._id}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>

          {order.items.map((item, i) => (
            <p key={i}>
              {item.title} × {item.quantity}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
