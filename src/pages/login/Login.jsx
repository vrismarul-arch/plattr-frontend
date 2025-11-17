import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // centralized axios instance

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    // Dynamic import for jwt-decode
    const { default: jwt_decode } = await import("jwt-decode");
    const decoded = jwt_decode(credentialResponse.credential);

    try {
      // Use centralized api instance
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Login with Google</h1>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
      />
    </div>
  );
};

export default Login;
