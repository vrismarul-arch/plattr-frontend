import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored)); // contains picture URL
    }
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2>No user logged in</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        border: "1px solid #ddd",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={user.picture}
        alt="Profile"
        style={{
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <h2 style={{ marginTop: "10px" }}>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        style={{
          marginTop: "20px",
          background: "#4285F4",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
 