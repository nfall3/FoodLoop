import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setMessage("");
      return;
    }

    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage("Signup successful! Please login.");
          setError("");
        } else if (res.status === 409) {
          setError("Email already registered");
          setMessage("");
        } else {
          setError("Signup failed");
          setMessage("");
        }
      })
      .catch(() => {
        setError("Signup failed");
        setMessage("");
      });
  }

  return (
    <div className="signup-page">
      <header className="header">
        <h1 className="title">FoodLoop</h1>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
      </header>

      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <h2>Create an Account</h2>
          <p>Welcome to FoodLoop! If you are a volunteer, business, or partner, please sign up or login</p>

          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-btn">
            Sign up with email
          </button>

          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
        </form>
      </div>

      <footer className="footer">FAQ</footer>
    </div>
  );
}

export default SignUp;