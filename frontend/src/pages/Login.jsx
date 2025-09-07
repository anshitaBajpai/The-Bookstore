import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      // ✅ Save user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      alert("Login successful ✅");
      navigate("/"); // Redirect to home
    } catch (err) {
      alert(err.response?.data?.error || "Login failed ❌");
    }
  };

  return (
    <>
      <Header />
      <div style={{
        padding: "32px",
        maxWidth: 400,
        margin: "0 auto",
        background: "linear-gradient(120deg, #232946 0%, #7fffd4 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px #1a223f55"
      }}>
        <h2 style={{ textAlign: "center", color: "#232946", fontWeight: 700, fontSize: "2rem", marginBottom: 32, letterSpacing: 1 }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #7fffd4",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622"
            }}
            onFocus={e => e.target.style.border = "2px solid #232946"}
            onBlur={e => e.target.style.border = "1.5px solid #7fffd4"}
          />
          <button
            type="submit"
            style={{
              background: "#7fffd4",
              color: "#232946",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #23294622",
              transition: "background 0.2s, color 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = "#232946";
              e.currentTarget.style.color = "#7fffd4";
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = "#7fffd4";
              e.currentTarget.style.color = "#232946";
            }}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
