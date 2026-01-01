import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          padding: "32px",
          background:
            "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            fontWeight: 700,
            color: "#134e4a",
            marginBottom: "32px",
          }}
        >
          📦 Your Orders
        </h1>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#134e4a",
              marginTop: "80px",
            }}
          >
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: "#232946",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
                  border: "1.5px solid #3b4a6b",
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "#a3bffa", fontWeight: 600 }}>
                    Order ID: {order._id.slice(-6)}
                  </span>
                  <span style={{ color: "#7fffd4", fontWeight: 600 }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Items */}
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #3b4a6b",
                    }}
                  >
                    <span style={{ color: "#eebbc3", fontWeight: 600 }}>
                      {item.title}
                    </span>
                    <span style={{ color: "#a3bffa" }}>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                ))}

                {/* Total */}
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#7fffd4",
                  }}
                >
                  Total: ₹{order.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
