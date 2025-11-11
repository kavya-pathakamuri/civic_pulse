import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState("Contact");

  const user = JSON.parse(localStorage.getItem("user")); // fetch user info

  const renderContent = () => {
    switch (section) {
      case "Home":
        return (
          <>
            <h3>Welcome {user?.name || "Guest"}</h3>
            <p>
              This is the unified portal for citizens to access smart city
              services and give feedback.
            </p>
          </>
        );
      case "About":
        return (
          <>
            <h3>About Us</h3>
            <p>
              Infosys CivicPulse Hub connects people with their city’s public
              services and ensures transparency.
            </p>
          </>
        );
      case "Contact":
        return (
          <>
            <h3>Contact</h3>
            <p>Email: support@civicpulse.example</p>
            <p>Phone: +91-98765-43210</p>
            <p>Address: 123 Civic Plaza, City Name</p>
          </>
        );
      case "Services":
        return (
          <>
            <h3>Services</h3>
            <ul>
              <li>Smart City Feedback</li>
              <li>Public Grievance Redressal</li>
              <li>Citizen Registration</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  const handleDashboardClick = () => {
    navigate("/dashboard"); // go to dashboard if logged in
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear user session
    navigate("/login"); // redirect to login
  };

  return (
    <div className="home-page">
      <header className="header">
        Infosys_CivicPulse Hub Unified Smart City Feedback and Redressal System
      </header>

      <div className="main">
        <div className="sidebar">
          <button className="nav-btn" onClick={() => setSection("Home")}>
            Home
          </button>
          <button className="nav-btn" onClick={() => setSection("About")}>
            About
          </button>
          <button className="nav-btn" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => setSection("Contact")}>
            Contact
          </button>
          <button className="nav-btn" onClick={() => setSection("Services")}>
            Services
          </button>
        </div>

        <div className="content">{renderContent()}</div>

        <div className="ads-logout">
          <div className="ads">
            <h4>Sponsored Ads</h4>
            <button className="ad-btn">Ad 1</button>
            <button className="ad-btn">Ad 2</button>
            <button className="ad-btn">Ad 3</button>
          </div>

          {/* Logout button under ads */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> |{" "}
          <a href="#">Help</a>
        </div>
        <div className="footer-copy">© 2025 My Website. All rights reserved</div>
      </footer>
    </div>
  );
}
