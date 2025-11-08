import { useState } from "react";
import axios from "axios";

const SantricksForm = () => {

  // Backend URL (hardcoded)
  const API_URL = "https://santrickbackenew.vercel.app";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/entries/add`, formData);

      alert("✅ Submitted Successfully! Check your email.");
      setFormData({ name: "", email: "", phone: "", message: "" });

    } catch (error) {
      console.log(error);
      alert("❌ Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "450px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Contact Form</h2><br/>

      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />

      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "12px" }} />

      <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} style={{ width: "100%", padding: "10px", marginBottom: "12px" }}></textarea>

      <button type="submit" style={{ width: "100%", padding: "12px", fontSize: "16px" }}>Submit</button>
    </form>
  );
};

export default SantricksForm;
