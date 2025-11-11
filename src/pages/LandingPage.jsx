import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const nav = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="landing-page">
      <div className="overlay">
        <div className="container">
          <h1 className="title">Infosys Civic Public Hub</h1>
          <p className="subtitle">
            Empowering citizens with seamless access to public services and community solutions.
          </p>
          <p className="motivation">
            "Your voice can create change — contribute, report, and be a part of a smarter, cleaner city!"
          </p>
          <div className="button-group">
            <button className="btn btn-register" onClick={() => nav("/register")}>
              📝 User Registration
            </button>
            <button className="btn btn-login" onClick={() => nav("/login")}>
              🔑 User Login
            </button>

            {/* ORIGINAL BUTTON (unchanged) */}
            <button className="btn btn-admin" onClick={toggleMenu}>
              🛡️ Admin Login
            </button>

            {/* ADDED POPUP MENU (only shown when button is clicked) */}
            {showMenu && (
              <div className="login-popup">
                <button className="popup-btn" onClick={() => nav("/admin")}>
                  👑 Login as Admin
                </button>
                <button className="popup-btn" onClick={() => nav("/officer")}>
                  👮 Login as Officer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
