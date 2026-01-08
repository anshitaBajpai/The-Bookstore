import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        username,
        email,
        password,
      });
      setError("");
      // Save user info to localStorage if backend returns token, role, username
      if (res.data.token && res.data.role && res.data.username) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        alert("Signup successful! Redirecting to home page...");
        navigate("/");
      } else {
        alert("User registered successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <>
      <div
        style={{
          padding: "32px",
          maxWidth: 400,
          margin: "0 auto",
          background: "linear-gradient(120deg, #232946 0%, #eebbc3 100%)",
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
            letterSpacing: 1,
          }}
        >
          Signup
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #eebbc3",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622",
            }}
            onFocus={(e) => (e.target.style.border = "2px solid #232946")}
            onBlur={(e) => (e.target.style.border = "1.5px solid #eebbc3")}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #eebbc3",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622",
            }}
            onFocus={(e) => (e.target.style.border = "2px solid #232946")}
            onBlur={(e) => (e.target.style.border = "1.5px solid #eebbc3")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #eebbc3",
              fontSize: "1.1rem",
              transition: "border 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 8px #23294622",
            }}
            onFocus={(e) => (e.target.style.border = "2px solid #232946")}
            onBlur={(e) => (e.target.style.border = "1.5px solid #eebbc3")}
          />
          <button
            type="submit"
            style={{
              background: "#eebbc3",
              color: "#232946",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #23294622",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#232946";
              e.currentTarget.style.color = "#eebbc3";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#eebbc3";
              e.currentTarget.style.color = "#232946";
            }}
          >
            Signup
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
      </div>
    </>
  );
}

export default Signup;
