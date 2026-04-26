import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
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
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully");
      navigate("/auth");
    } catch (err) {
      const message = err.response?.data?.error || "Invalid or expired reset link";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cardPage}>
      <div className={styles.cardPageInner}>
        <h2 className={styles.cardHeading}>Reset Password</h2>
        <p className={styles.cardSubheading}>Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={styles.input}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading && <span className={styles.spinner} />}
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <p className={styles.switchText}>
          <Link to="/auth">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
