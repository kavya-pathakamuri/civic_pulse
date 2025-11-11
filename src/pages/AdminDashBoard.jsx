import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("total");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignment, setAssignment] = useState({
    department: "Water",
    officer: "Ravi Kumar",
    deadline: "",
    comments: "",
  });
  const [showTrackPopup, setShowTrackPopup] = useState(false);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("complaints");
    const storedFeedbacks = localStorage.getItem("feedbacks");
    if (stored) setComplaints(JSON.parse(stored));
    if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));
  }, []);

  const handleSaveAssignment = () => {
    const updated = complaints.map((c) =>
      c.grievanceId === selectedComplaint.grievanceId
        ? { ...c, ...assignment }
        : c
    );
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
    setSelectedComplaint(null);
  };

  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);

    // Auto officer mapping
    const officerMapping = {
      Water: "Ravi Kumar",
      Electricity: "Anil Singh",
      Roads: "Kiran Kumar",
      Sanitation: "Ramesh Gupta",
    };

    setAssignment({
      department: complaint.department || "Water",
      officer:
        complaint.officer ||
        officerMapping[complaint.department || "Water"],
      deadline: complaint.deadline || "",
      comments: complaint.comments || "",
    });

    setShowAssignPopup(true);
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const filteredComplaints =
    filter === "total"
      ? complaints
      : complaints.filter(
          (c) => c.status.toLowerCase() === filter.toLowerCase()
        );

  const getFeedback = (grievanceId) =>
    feedbacks.find((f) => f.grievanceId === grievanceId);

  const hasLowRating = (id) => {
    const f = getFeedback(id);
    return f && f.rating < 3;
  };

  const hasGoodRating = (id) => {
    const f = getFeedback(id);
    return f && f.rating >= 3;
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-card">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>

        <div className="admin-stats">
          <button
            className={`btn total ${filter === "total" ? "active" : ""}`}
            onClick={() => setFilter("total")}
          >
            Total ({total})
          </button>
          <button
            className={`btn pending ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({pending})
          </button>
          <button
            className={`btn resolved ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            Resolved ({resolved})
          </button>
        </div>

        {filteredComplaints.length === 0 ? (
          <p className="no-data">
            {filter === "total"
              ? "No complaints found."
              : `No ${filter} complaints found.`}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Assigned Officer</th>
                <th>Deadline</th>
                <th>Track</th>
                <th>Assign / Reassign</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c, index) => {
                const lowRating = hasLowRating(c.grievanceId);
                const goodRating = hasGoodRating(c.grievanceId);

                return (
                  <tr
                    key={c.grievanceId}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <td>{c.grievanceId}</td>
                    <td>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.location}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          c.status === "Resolved"
                            ? "resolved"
                            : c.status === "In Progress"
                            ? "progress"
                            : "pending"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td>{c.officer || "Not Assigned"}</td>
                    <td>{c.deadline || "-"}</td>

                    <td>
                      <button
                        className="track-btn"
                        onClick={() => {
                          setSelectedComplaint(c);
                          setShowTrackPopup(true);
                        }}
                      >
                        Track
                      </button>
                    </td>

                    <td>
                      <button
                        className={`assign-btn ${
                          goodRating
                            ? "disabled-btn"
                            : lowRating
                            ? "reassign-btn"
                            : c.officer
                            ? "assigned"
                            : ""
                        }`}
                        disabled={goodRating || (!lowRating && c.officer)}
                        onClick={() => {
                          if (!goodRating) handleAssignClick(c);
                        }}
                      >
                        {goodRating
                          ? "Feedback Satisfied"
                          : lowRating
                          ? "Reassign (Low Rating)"
                          : c.officer
                          ? "Assigned"
                          : "Assign"}
                      </button>
                    </td>

                    <td>
                      <button
                        className="feedback-btn"
                        onClick={() => {
                          const feedbacksData =
                            JSON.parse(localStorage.getItem("feedbacks")) || [];
                          const feedback = feedbacksData.find(
                            (f) => f.grievanceId === c.grievanceId
                          );
                          setSelectedFeedback(feedback || null);
                          setShowFeedbackPopup(true);
                        }}
                      >
                        View Feedback
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Track Popup */}
      {showTrackPopup && selectedComplaint && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Complaint Progress</h3>
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
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
              <strong>Remarks:</strong>{" "}
              {selectedComplaint.remarks || "No updates yet"}
            </p>

            {selectedComplaint.progressPhoto ? (
              <img
                src={selectedComplaint.progressPhoto}
                alt="Progress"
                className="popup-preview"
              />
            ) : (
              <p>No progress image uploaded yet.</p>
            )}

            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  const updated = complaints.map((c) =>
                    c.grievanceId === selectedComplaint.grievanceId
                      ? {
                          ...c,
                          resolvedAt:
                            selectedComplaint.status === "Resolved"
                              ? new Date().toISOString()
                              : c.resolvedAt || null,
                        }
                      : c
                  );
                  setComplaints(updated);
                  localStorage.setItem("complaints", JSON.stringify(updated));

                  setShowTrackPopup(false);
                  setSelectedComplaint(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Assign/Reassign Popup (Updated Only This Part) */}
      {showAssignPopup && selectedComplaint && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>
              {selectedComplaint.officer ? "Reassign Complaint" : "Assign Complaint"}
            </h3>

            {/* ✅ Department Dropdown */}
            <label>
              Department:
              <select
                value={assignment.department}
                onChange={(e) => {
                  const dept = e.target.value;

                  const officerMapping = {
                    Water: "Ravi Kumar",
                    Electricity: "Anil Singh",
                    Roads: "Kiran Kumar",
                    Sanitation: "Ramesh Gupta",
                  };

                  setAssignment({
                    ...assignment,
                    department: dept,
                    officer: officerMapping[dept],
                  });
                }}
              >
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Roads">Roads</option>
                <option value="Sanitation">Sanitation</option>
              </select>
            </label>

            {/* ✅ Officer Auto-filled */}
            <label>
              Officer:
              <input type="text" value={assignment.officer} readOnly />
            </label>

            <label>
              Deadline:
              <input
                type="date"
                value={assignment.deadline}
                onChange={(e) =>
                  setAssignment({ ...assignment, deadline: e.target.value })
                }
              />
            </label>

            <label>
              Comments:
              <textarea
                value={assignment.comments}
                onChange={(e) =>
                  setAssignment({ ...assignment, comments: e.target.value })
                }
              />
            </label>

            <div className="popup-actions">
              <button
                className="save-btn"
                onClick={() => {
                  handleSaveAssignment();
                  setShowAssignPopup(false);
                }}
              >
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowAssignPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Popup */}
      {showFeedbackPopup && (
        <div className="popup-overlay">
          <div className="popup-card feedback-popup-card">
            <h3>User Feedback</h3>

            {selectedFeedback ? (
              <>
                <p>
                  <strong>Grievance ID:</strong> {selectedFeedback.grievanceId}
                </p>
                <p>
                  <strong>Rating:</strong> {"⭐".repeat(selectedFeedback.rating)}
                </p>
                <p>
                  <strong>Comment:</strong> {selectedFeedback.comment}
                </p>
                {selectedFeedback.image && (
                  <img
                    src={selectedFeedback.image}
                    alt="Feedback"
                    className="popup-preview"
                  />
                )}
                <p>
                  <strong>Submitted At:</strong> {selectedFeedback.submittedAt}
                </p>
              </>
            ) : (
              <p>No feedback submitted yet for this complaint.</p>
            )}

            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowFeedbackPopup(false)}
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
