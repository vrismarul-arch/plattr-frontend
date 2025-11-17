import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./AdminProfile.css";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await api.get("/admin/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        setAdmin(res.data);
      } catch (err) {
        console.log("Error fetching admin profile");
      }
    }
    fetchAdmin();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Admin Profile</h2>

        {admin ? (
          <div className="profile-info">
            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Role:</strong> Administrator</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}
