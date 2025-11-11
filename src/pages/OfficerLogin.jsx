import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginOfficer.css";

export default function OfficerLogin() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    department: "",
  });

  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.department) {
      alert("Please fill all fields");
      return;
    }

    // Store officer info in localStorage (no validation)
    const officer = {
      username: form.username,
      password: form.password,
      department: form.department,
      name:
        form.department === "Water"
          ? "Ravi Kumar"
          : form.department === "Electricity"
          ? "Neha Sharma"
          : form.department === "Roads"
          ? "Arjun Singh"
          : form.department === "Sanitation"
          ? "Priya Mehta"
          : form.username,
    };

    localStorage.setItem("officerLoggedIn", JSON.stringify(officer));
    navigate("/officer-dashboard");
  };

  return (
    <div className="form-page">
      <div className="card">
        <h2>Officer Login</h2>
        <form onSubmit={submit}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>Select Department:</label>
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="Water">Water Department</option>
            <option value="Electricity">Electricity Department</option>
            <option value="Roads">Roads Department</option>
            <option value="Sanitation">Sanitation Department</option>
          </select>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
