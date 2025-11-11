import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function OfficerDashboard() {
  const officer = JSON.parse(localStorage.getItem("officerLoggedIn"));
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("complaints")) || [];
    setComplaints(saved);
  }, []);

  const handleUpdate = (id, updates) => {
    const updated = complaints.map((c) =>
      c.grievanceId === id ? { ...c, ...updates } : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
  };

  const handlePhotoUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const assignedComplaints = complaints.filter(
    (c) => c.officer === officer.username
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <h2 className="admin-dashboard-title">
          Officer Dashboard – {officer.username}
        </h2>

        {assignedComplaints.length === 0 ? (
          <p className="no-data">No complaints assigned to you yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Update</th>
                <th>Save</th>
              </tr>
            </thead>
            <tbody>
              {assignedComplaints.map((c, index) => (
                <tr
                  key={c.grievanceId}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td>{c.grievanceId}</td>
                  <td>{c.title}</td>
                  <td>{c.category}</td>
                  <td>{c.location}</td>
                  <td>{c.deadline}</td>
                  <td>
                    <select
                      value={c.status}
                      onChange={(e) =>
                        handleUpdate(c.grievanceId, { status: e.target.value })
                      }
                      className="status-dropdown"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={c.remarks || ""}
                      placeholder="Enter remarks..."
                      onChange={(e) =>
                        handleUpdate(c.grievanceId, {
                          remarks: e.target.value,
                        })
                      }
                      className="remarks-input"
                    />
                  </td>
                  <td>
                    <button
                      className="track-btn"
                      onClick={() => {
                        setSelectedComplaint(c);
                        setPhotoPreview(c.progressPhoto || null);
                        setShowPopup(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                  <td>
                    <button
                      className="save-btn"
                      onClick={() =>
                        handleUpdate(c.grievanceId, {
                          status: c.status,
                          remarks: c.remarks,
                        })
                      }
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🪟 POPUP MODAL */}
      {showPopup && selectedComplaint && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Complaint Details</h3>
            <p>
              <strong>ID:</strong> {selectedComplaint.grievanceId}
            </p>
            <p>
              <strong>Title:</strong> {selectedComplaint.title}
            </p>
            <p>
              <strong>Category:</strong> {selectedComplaint.category}
            </p>
            <p>
              <strong>Location:</strong> {selectedComplaint.location}
            </p>
            <p>
              <strong>Deadline:</strong> {selectedComplaint.deadline}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
              <strong>Remarks:</strong> {selectedComplaint.remarks || "—"}
            </p>

            <div className="photo-section">
              <label className="upload-label">Upload Progress Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files[0])}
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="popup-preview"
                />
              )}
            </div>

            <div className="popup-actions">
              <button
                className="save-btn"
                onClick={() => {
                  handleUpdate(selectedComplaint.grievanceId, {
                    progressPhoto: photoPreview,
                  });
                  setShowPopup(false);
                }}
              >
                Save Update
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
