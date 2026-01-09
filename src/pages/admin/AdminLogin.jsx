import React, { useState } from "react";
import api from "../../api/api";
import { Input } from "antd"; // ✅ antd
import "antd/dist/reset.css";
import "./AdminLogin.css";

import illustration from "./side.png";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/vrism.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="container">
      {/* Logos */}
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo" />
        <img src={logo2} alt="Secondary Logo" className="logo-secondary" />
      </div>

      <div className="form-container">
        <div className="form-content">
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Please enter your admin details</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleLogin} className="form">
            {/* EMAIL */}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
              required
            />

            {/* PASSWORD — antd with visibility toggle */}
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
              visibilityToggle // 👁️ built-in
              required
            />

            <div className="options">
              <label>
                <input type="checkbox" /> Remember for 30 days
              </label>
              <a href="#" className="forgot">Forgot password?</a>
            </div>

            <button type="submit" className="btn">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="image-container">
        <img src={illustration} alt="Admin Illustration" className="image" />
      </div>
    </div>
  );
}
