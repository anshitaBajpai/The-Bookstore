import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      setError("");
      navigate("/"); // redirect to home after login
    } catch (err) {
      setError(err.response?.data?.error || "Login failed ❌");
    }
  };

  // ✅ Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
      setError("");
      alert("Signup successful! Please login.");
      setIsLogin(true); // switch to login form
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed ❌");
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "32px",
          maxWidth: 400,
          margin: "40px auto",
          background: "linear-gradient(120deg, #232946 0%, #7fffd4 100%)",
          borderRadius: "16px",
          boxShadow: "0 4px 24px #1a223f55",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#232946",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 32,
          }}
        >
          {isLogin ? "Login" : "Signup"}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1.5px solid #7fffd4",
              }}
            />
          )}
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
            }}
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
            }}
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
              transition: "0.2s",
            }}
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {error && (
          <p
            style={{
              color: "#e53935",
              textAlign: "center",
              marginTop: "18px",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "20px", color: "#232946" }}>
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  border: "none",
                  background: "none",
                  color: "#0000ee",
                  cursor: "pointer",
                }}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  border: "none",
                  background: "none",
                  color: "#0000ee",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </>
  );
}

export default AuthPage;
