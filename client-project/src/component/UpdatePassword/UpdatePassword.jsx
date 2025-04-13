import React, { useState } from "react";
import "./UpdatePassword.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }

    try {
      const token = localStorage.getItem("accessToken"); // Get token from storage

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/reset-password`,
        { currentPassword, newPassword, confirmPassword }, // Send all 3 values
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🚀 ~ handleSubmit ~ response:", response);
      setSuccess("Password updated successfully!");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (err) {
      console.error("🚨 ~ handleSubmit ~ error:", err);
      setError(err?.response?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="update-password-container">
      <form className="update-password-form" onSubmit={handleSubmit}>
        <h2>Update Password</h2>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
