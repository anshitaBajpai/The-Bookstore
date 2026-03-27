import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config.js";
import styles from "./AuthPage.module.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      navigate("/auth");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reset Password</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          minLength={6}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={styles.input}
          required
          minLength={6}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.switchText}>
        <Link to="/auth">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
