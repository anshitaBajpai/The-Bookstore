import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config.js";
import styles from "./AuthPage.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Forgot Password</h2>
      <p style={{ color: "#aaa", marginBottom: "1rem", textAlign: "center" }}>
        Enter your email and we'll send you a reset link.
      </p>

      {message ? (
        <p className={styles.switchText} style={{ color: "#4ade80", textAlign: "center" }}>
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.switchText}>
        <Link to="/auth">Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
