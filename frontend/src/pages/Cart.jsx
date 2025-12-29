import Header from "../components/Header";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();

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
        }
      );

      alert("✅ Order placed successfully");
      navigate("/orders");
    } catch (err) {
      alert("❌ Failed to place order");
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)",
            color: "#134e4a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          Your cart is empty
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(120deg, #e0ffef 0%, #43c6ac 60%, #191654 100%)",
          color: "#134e4a",
          padding: "32px 0",
        }}
      >
        <h2
          style={{
            marginBottom: "28px",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 700,
          }}
        >
          Your Cart
        </h2>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "18px",
                padding: "18px 16px",
                background: "#232946",
                borderRadius: "14px",
                boxShadow: "0 2px 12px #1a223f99",
                border: "1.5px solid #3b4a6b",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "18px" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "60px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    background: "#1a223f",
                  }}
                />
                <div>
                  <h4 style={{ color: "#a3bffa", fontWeight: 700 }}>
                    {item.title}
                  </h4>
                  <p style={{ color: "#7fffd4", fontWeight: 600 }}>
                    ₹{item.price}
                  </p>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  style={{
                    background: "#3b4a6b",
                    color: "#a3bffa",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 12px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#232946")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#3b4a6b")
                  }
                >
                  -
                </button>
                <span style={{ color: "#eebbc3", fontWeight: 600 }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  style={{
                    background: "#3b4a6b",
                    color: "#a3bffa",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 12px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#232946")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#3b4a6b")
                  }
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <h3
          style={{
            textAlign: "right",
            marginTop: "32px",
            color: "#7fffd4",
            fontWeight: 700,
            fontSize: "1.3rem",
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Total: ₹{totalPrice}
        </h3>

        <div style={{ maxWidth: 700, margin: "20px auto", textAlign: "right" }}>
          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            style={{
              padding: "12px 24px",
              background: "#134e4a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px #134e4a55",
              opacity: cart.length === 0 ? 0.6 : 1,
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;
