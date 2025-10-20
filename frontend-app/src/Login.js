import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login Successful!") {
          setMessage("Login Successful!");
          setError("");
        } else if (data.message === "Incorrect password") {
          setError("Incorrect password");
          setMessage("");
        } else if (data.message === "User not found") {
          setError("User not found");
          setMessage("");
        } else {
          setError("Login failed");
          setMessage("");
        }
      })
      .catch(() => {
        setError("Login failed");
        setMessage("");
      });
  }

  return (
    <div className="login-page">
      <header className="header">
        <h1 className="title">FoodLoop</h1>
        <button className="signup-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </header>

      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Log In</h2>
          <p>Enter your email and password to access your account</p>

          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Log In
          </button>

          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
        </form>
      </div>

      <footer className="footer">FAQ</footer>
    </div>
  );
}

export default Login;