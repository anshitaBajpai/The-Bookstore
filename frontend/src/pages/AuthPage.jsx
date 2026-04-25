import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./AuthPage.module.css";
import { API_URL } from "../config.js";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const switchMode = (mode) => {
    setIsLogin(mode === "login");
    setError("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
        toast.success("Signed in successfully");
        navigate("/");
      } else {
        try {
          const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: formData.email,
            password: formData.password,
          });
          localStorage.setItem("token", loginRes.data.token);
          localStorage.setItem("role", loginRes.data.role);
          localStorage.setItem("username", loginRes.data.username);
          axios.defaults.headers.common.Authorization = `Bearer ${loginRes.data.token}`;
          toast.success("Account created successfully");
          navigate("/");
        } catch (loginErr) {
          const message =
            loginErr.response?.data?.error ||
            "Signup succeeded but auto-login failed";
          setError(message);
          toast.error(message);
          setIsLogin(true);
        }
      }
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left — Brand Panel */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <h1 className={styles.brandName}>The BookStore</h1>
          <p className={styles.brandTagline}>
            A curated collection for thoughtful readers.
          </p>
          <div className={styles.brandQuote}>
            <span className={styles.quoteText}>
              "A reader lives a thousand lives before he dies. The man who never
              reads lives only one."
            </span>
            <span className={styles.quoteAuthor}>— George R.R. Martin</span>
          </div>
        </div>
        <div className={styles.brandDecor1} />
        <div className={styles.brandDecor2} />
      </div>

      {/* Right — Form Panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${isLogin ? styles.tabActive : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tab} ${!isLogin ? styles.tabActive : ""}`}
              onClick={() => switchMode("signup")}
            >
              Create Account
            </button>
          </div>

          <p className={styles.subheading}>
            {isLogin
              ? "Welcome back. Sign in to continue."
              : "Join us and start your reading journey."}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Sara"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  autoComplete="username"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                {isLogin && (
                  <Link to="/forgot-password" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={
                    isLogin ? "Enter your password" : "Min. 6 characters"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  minLength={isLogin ? undefined : 6}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading && <span className={styles.spinner} />}
              {loading
                ? isLogin
                  ? "Signing in…"
                  : "Creating account…"
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className={styles.switchText}>
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span onClick={() => switchMode("signup")}>Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => switchMode("login")}>Sign in</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
