import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../api/api";
import logo from "../../assets/logo.png";
import "./LoginPage.css";

const Login = () => {

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      // ✅ 반드시 둘ையும் save
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ full reload (context sync fix)
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={logo} alt="PLATTR" className="login-logo" />

        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <div className="login-body">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Login Failed")}
            theme="filled_blue"
            size="large"
            text="continue_with"
            shape="pill"
          />
        </div>

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
