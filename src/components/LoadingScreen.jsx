// src/components/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";
import logo from "../assets/logo.png";

const LoadingScreen = ({ text = "Fetching delicious meals..." }) => {
  return (
    <div className="loading-screen">
      <div className="loader-content">

        {/* Logo */}

        {/* Three bouncing dots – perfectly centered */}
        <div className="dot-loader">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
        </div>

        {/* Text */}
        <p className="loading-text">{text}</p>

      </div>
    </div>
  );
};

export default LoadingScreen;