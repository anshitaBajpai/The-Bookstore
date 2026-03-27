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
    <div className={styles.cardPage}>
      <div className={styles.cardPageInner}>
        <h2 className={styles.cardHeading}>Forgot Password</h2>
        <p className={styles.cardSubheading}>
          Enter your email and we'll send you a reset link.
        </p>

        {message ? (
          <p className={styles.successMsg}>{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className={styles.switchText}>
          <Link to="/auth">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
