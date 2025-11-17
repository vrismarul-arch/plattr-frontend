  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import "./Profile.css";

  export default function Profile() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
    });

    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setFormData({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || "",
        });
      }
    }, []);

    const handleChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:5000/api/users/${user._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setEditMode(false);
        alert("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to update profile.");
      }
    };

    if (!user) {
      return (
        <div className="center-wrapper">
          <div className="center-message">No user logged in</div>
        </div>
      );
    }

    return (
      <div className="center-wrapper">
        <div className="profile-wrapper">

          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {user.picture ? (
                <img src={user.picture} alt="Profile" />
              ) : (
                user.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div className="profile-title">
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <h2>{user.name}</h2>
              )}
              <p>Welcome back to your profile</p>
            </div>

            <div className="profile-actions">
              <button onClick={() => window.location.reload()}>↻</button>
              
            </div>
          </div>

          {/* Info */}
          <div className="section-title">Profile Information</div>

          <div className="profile-info-grid">
            <div>
              <p className="info-label">FULL NAME</p>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <p className="info-value">{user.name}</p>
              )}
            </div>

            <div>
              <p className="info-label">EMAIL ADDRESS</p>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p className="info-value">{user.email}</p>
              )}
            </div>

            

          </div>

        
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
