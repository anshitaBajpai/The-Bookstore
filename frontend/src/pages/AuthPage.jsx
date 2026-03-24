import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : formData;

    try {
      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        navigate("/");
      } else {
        // After successful signup, attempt to auto-login the user
        try {
          const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: formData.email,
            password: formData.password,
          });

          localStorage.setItem("role", loginRes.data.role);
          localStorage.setItem("username", loginRes.data.username);
          navigate("/");
        } catch (loginErr) {
          // If auto-login fails, fall back to showing signup success and switch to login
          setError(
            loginErr.response?.data?.error ||
              "Signup succeeded but auto-login failed",
          );
          setIsLogin(true);
        }
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong ❌");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          required
        />

        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit" className={styles.button}>
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.switchText}>
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Signup</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </>
        )}
      </p>
    </div>
  );
}

export default AuthPage;
