import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import { FaClipboardList, FaSearchLocation } from "react-icons/fa";

export default function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("complaints");
    return saved ? JSON.parse(saved) : [];
  });
  const [grievanceId, setGrievanceId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    title: "",
    category: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const generateGrievanceId = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}`;
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `GRV-${datePart}-${randomPart}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generateGrievanceId();

    const newComplaint = {
      ...formData,
      file: uploadedFile ? uploadedFile.name : null,
      grievanceId: newId,
      status: "Pending",
    };

    setComplaints([...complaints, newComplaint]);
    setGrievanceId(newId);

    setFormData({
      email: "",
      title: "",
      category: "",
      location: "",
      description: "",
    });
    setUploadedFile(null);
    setView("success");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const found = complaints.find((c) => c.grievanceId === searchId);
    setSearchResult(found || "notfound");
  };

  // ===================== 🌟 FEEDBACK FEATURE ==========================
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: "",
    image: null,
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const newFeedback = {
      grievanceId: searchResult.grievanceId,
      rating: feedbackData.rating,
      comment: feedbackData.comment,
      image: feedbackData.image,
      submittedAt: new Date().toLocaleString(),
    };
    localStorage.setItem("feedbacks", JSON.stringify([...existing, newFeedback]));
    setShowFeedbackPopup(false);
    setFeedbackData({ rating: 0, comment: "", image: null });
    alert("✅ Feedback submitted successfully! Thank you for helping us improve.");
  };

  const handleFeedbackImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackData({ ...feedbackData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  // ===================================================================

  return (
    <div className="dashboard-container">
      {view === "dashboard" && (
        <>
          <h2 className="dashboard-heading">CivicPulse Complaint Dashboard</h2>
          <p className="dashboard-quote">
            "Empowering citizens — one complaint at a time to build a better tomorrow."
          </p>
        </>
      )}

      {view === "dashboard" && (
        <div className="dashboard-buttons">
          <button className="dashboard-btn" onClick={() => setView("submit")}>
            <FaClipboardList className="icon" /> Submit Complaint
            <p className="btn-info">
              Raise your concern easily — we’ll ensure it reaches the right place.
            </p>
          </button>

          <button className="dashboard-btn" onClick={() => setView("track")}>
            <FaSearchLocation className="icon" /> Track Complaints
            <p className="btn-info">
              Check your complaint status anytime with your unique Grievance ID.
            </p>
          </button>
        </div>
      )}

      {/* Complaint Submit Form */}
      {view === "submit" && (
        <div className="complaint-form-container">
          <h2>Submit a Complaint</h2>
          <form className="complaint-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              <option value="garbage">Garbage</option>
              <option value="water">Water Supply</option>
              <option value="road">Road Maintenance</option>
            </select>
            <label>Location</label>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
            <label>Description</label>
            <textarea
              placeholder="Describe your complaint..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <label>Upload File</label>
            <input type="file" onChange={handleFileChange} />
            {uploadedFile && uploadedFile.type.startsWith("image/") && (
              <div className="preview">
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Preview"
                  className="preview-img"
                />
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setView("dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Page */}
      {view === "success" && (
        <div className="success-container">
          <h2>Complaint Submitted Successfully!</h2>
          <p>Please make sure to note down your Grievance ID for future tracking:</p>
          <div className="grievance-id">{grievanceId}</div>
          <p className="note-message">
            ⚠️ This ID is required to check your complaint status. Keep it safe.
          </p>
          <button className="dashboard-btn" onClick={() => setView("dashboard")}>
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Track Complaint */}
      {view === "track" && (
        <div className="track-container">
          <h2>Track Complaint</h2>
          <form className="track-form" onSubmit={handleSearch}>
            <label>Enter Grievance ID</label>
            <input
              type="text"
              placeholder="GRV-YYYYMMDD-xxxx"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
            <div style={{ marginTop: "10px" }}>
              <button type="submit" className="track-btn">
                Search
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setView("dashboard");
                  setSearchResult(null);
                }}
              >
                Back
              </button>
            </div>
          </form>

          {searchResult && searchResult !== "notfound" && (
            <div className="result-table-container">
              <h3>Complaint Details</h3>
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Grievance ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{searchResult.grievanceId}</td>
                    <td>{searchResult.title}</td>
                    <td>{searchResult.category}</td>
                    <td>{searchResult.location}</td>
                    <td>
                      <span
                        className={`status-badge ${searchResult.status.toLowerCase()}`}
                      >
                        {searchResult.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 🌟 Show feedback option if resolved */}
              {searchResult.status === "Resolved" && (
                <div className="feedback-section">
                  <button
                    className="feedback-btn"
                    onClick={() => setShowFeedbackPopup(true)}
                  >
                    🌟 Give Feedback
                  </button>
                </div>
              )}
            </div>
          )}
          {searchResult === "notfound" && (
            <div className="no-result">
              No complaint found with this Grievance ID.
            </div>
          )}

          {/* 🌟 FEEDBACK POPUP */}
          {showFeedbackPopup && (
            <div className="popup-overlay">
              <div className="feedback-popup-card">
                <h3>We value your feedback 💬</h3>
                <p>How satisfied are you with the resolution?</p>

                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= feedbackData.rating ? "filled" : ""}`}
                      onClick={() =>
                        setFeedbackData({ ...feedbackData, rating: star })
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                  <textarea
                    placeholder="Share your thoughts..."
                    value={feedbackData.comment}
                    onChange={(e) =>
                      setFeedbackData({ ...feedbackData, comment: e.target.value })
                    }
                    required
                  ></textarea>

                  <label className="upload-label">Attach an image (optional):</label>
                  <input type="file" accept="image/*" onChange={handleFeedbackImage} />

                  {feedbackData.image && (
                    <img
                      src={feedbackData.image}
                      alt="Feedback Preview"
                      className="feedback-preview"
                    />
                  )}

                  <div className="popup-actions">
                    <button type="submit" className="save-btn">
                      Submit Feedback
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowFeedbackPopup(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
