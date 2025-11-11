// AdminHome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function AdminHome() {
  const navigate = useNavigate();
  const [section, setSection] = useState("Dashboard");

  const handleDashboardClick = () => navigate("/admin-dashboard");
  const handleLogoutClick = () => navigate("/admin");
  const handleStatisticsClick = () => navigate("/admin-statistics");

  return (
    <div className="home-page">
      <header className="header">Admin Home - CivicPulse Hub</header>

      <div className="main">
        <div className="sidebar">
          <button className="nav-btn" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={handleStatisticsClick}>
            Statistics
          </button>
          <button className="nav-btn" onClick={() => setSection("About")}>
            About
          </button>
          <button className="nav-btn" onClick={() => setSection("Services")}>
            Services
          </button>
          <button className="nav-btn" onClick={() => setSection("Contact")}>
            Contact
          </button>
          <button className="nav-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>

        <div className="content">
          <h2>Welcome to Admin Dashboard</h2>
          <p>Select a section from the sidebar to manage the system.</p>
        </div>

        <div className="ads">
          <h4>Sponsored Ads</h4>
          <button className="ad-btn">Ad 1</button>
          <button className="ad-btn">Ad 2</button>
          <button className="ad-btn">Ad 3</button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> |{" "}
          <a href="#">Help</a>
        </div>
        <div className="footer-copy">
          © 2025 CivicPulse Hub. All rights reserved
        </div>
      </footer>
    </div>
  );
}
