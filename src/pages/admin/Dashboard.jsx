import React from "react";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Welcome Admin</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
