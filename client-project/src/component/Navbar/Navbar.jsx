import React from "react";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage/token, etc.
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">Skygoal</div>
      <div className="navbar__actions">
        <button onClick={handleUpdatePassword}>Update Password</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
