import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "admin123") {
      setMsg("Welcome Admin");
      setTimeout(() => navigate("/admin-home"), 500); // Navigate after 0.5s
    } else setMsg("Invalid admin credentials");
  };

  return (
    <div className="form-page">
      <div className="card">
        <h2>Admin Login</h2>
        <form onSubmit={submit}>
          <input
            className="input"
            placeholder="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="submit" type="submit">
            Login
          </button>
        </form>
        <div className="message">{msg}</div>
      </div>
    </div>
  );
}
