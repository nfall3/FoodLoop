import logo from "./logo.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function IndividualSignUp() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password.includes(" ")) {
      setError("Password cannot contain spaces");
      setMessage("");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setError("Password must be between 8–20 characters");
      setMessage("");
      return;
    }

    if (!agreePrivacy || !agreeTerms) {
      setError("You must agree to the privacy policy and terms & conditions.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setMessage("");
      return;
    }
    fetch("http://localhost:3001/individual-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        password,
      }),
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
        <img src={logo} alt="FoodLoop Logo" className="logo-img" />
        <button className="login-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
      </header>

      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <h2>Individual Signup</h2>
          <p>Please fill in your information below.</p>

          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

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

          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
              />
              <label>
                I agree to the <a href="#">privacy policy</a>
              </label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label>
                I agree to the <a href="#">terms and conditions</a>
              </label>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Complete Signup
          </button>

          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
        </form>
      </div>

      <footer className="footer">FAQ</footer>
    </div>
  );
}

export default IndividualSignUp;
