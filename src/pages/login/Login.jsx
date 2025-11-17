import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // centralized axios instance
import loginImage from "./side.png"; // right side image
import logo from "../../assets/logo.png"; // your logo
import "./LoginPage.css";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const { default: jwt_decode } = await import("jwt-decode");
    const decoded = jwt_decode(credentialResponse.credential);

    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login with your Google account</p>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
        />
      </div>

      {/* Right Side */}
      <div className="login-right">
        <img src={loginImage} alt="Login Visual" className="login-image" />
      </div>
    </div>
  );
};

export default Login;
