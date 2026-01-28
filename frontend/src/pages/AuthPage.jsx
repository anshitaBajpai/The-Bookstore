import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AuthPage.module.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed ❌");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
      setError("");
      alert("Signup successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed ❌");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{isLogin ? "Login" : "Signup"}</h2>

      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        className={styles.form}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

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
