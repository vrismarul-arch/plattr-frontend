import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/logo.png"; // your PLATTR logo
import "./LoginPage.css";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo */}
        <img src={logo} alt="PLATTR" className="login-logo" />

        {/* Header */}
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to your account</p>
        </div>

        {/* Google Login */}
        <div className="login-body">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Login Failed")}
            useOneTap
            theme="filled_blue"
            size="large"
            text="continue_with"
            shape="pill"
          />
        </div>

        {/* Footer */}
        <div className="login-footer">
          By continuing, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
