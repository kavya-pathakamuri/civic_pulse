import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "./Statistics.css";

export default function AdminStatistics() {
  const navigate = useNavigate();
  const [deptData, setDeptData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [slaByLocation, setSlaByLocation] = useState([]);
  const [slaDept, setSlaDept] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("complaints")) || [];
    const now = new Date();

    // Department-wise distribution
    const deptCount = {};
    stored.forEach((c) => {
      const dept = c.department || "Unassigned";
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    });
    setDeptData(Object.entries(deptCount).map(([name, value]) => ({ name, value })));

    // Location-wise distribution
    const locCount = {};
    stored.forEach((c) => {
      const loc = c.location || "Unknown";
      locCount[loc] = (locCount[loc] || 0) + 1;
    });
    setLocationData(Object.entries(locCount).map(([location, complaints]) => ({ location, complaints })));

    // SLA by LOCATION
    const slaLoc = {};
    stored.forEach((c) => {
      const loc = c.location || "Unknown";
      if (!slaLoc[loc]) slaLoc[loc] = { location: loc, onTime: 0, delayed: 0 };

      const resolvedTime = c.resolvedAt ? new Date(c.resolvedAt) : null;
      const deadline = c.deadline ? new Date(c.deadline) : null;

      if (c.status === "Resolved") {
        if (resolvedTime && deadline) {
          resolvedTime <= deadline ? slaLoc[loc].onTime++ : slaLoc[loc].delayed++;
        } else {
          slaLoc[loc].onTime++;
        }
      } else {
        if (deadline && deadline < now) slaLoc[loc].delayed++;
      }
    });
    setSlaByLocation(Object.values(slaLoc));

    // SLA by DEPARTMENT
    const slaDepartment = {};
    stored.forEach((c) => {
      const dept = c.department || "Unassigned";
      if (!slaDepartment[dept]) slaDepartment[dept] = { department: dept, onTime: 0, delayed: 0 };

      const resolvedTime = c.resolvedAt ? new Date(c.resolvedAt) : null;
      const deadline = c.deadline ? new Date(c.deadline) : null;

      if (c.status === "Resolved") {
        if (resolvedTime && deadline) {
          resolvedTime <= deadline ? slaDepartment[dept].onTime++ : slaDepartment[dept].delayed++;
        } else {
          slaDepartment[dept].onTime++;
        }
      } else {
        if (deadline && deadline < now) slaDepartment[dept].delayed++;
      }
    });
    setSlaDept(Object.values(slaDepartment));

    // Summary
    setSummary({
      total: stored.length,
      pending: stored.filter((c) => c.status === "Pending").length,
      resolved: stored.filter((c) => c.status === "Resolved").length,
    });
  }, []);

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="stats-page">
      <header className="stats-header">
        <h2>📊 Complaint Analytics Dashboard</h2>
        <button className="back-btn" onClick={() => navigate("/admin-home")}>
          ⬅ Back to Dashboard
        </button>
      </header>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="card total"><h3>{summary.total}</h3><p>Total Complaints</p></div>
        <div className="card pending"><h3>{summary.pending}</h3><p>Pending</p></div>
        <div className="card resolved"><h3>{summary.resolved}</h3><p>Resolved</p></div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Complaints by Department</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {deptData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Complaints by Location</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={locationData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis allowDecimals={false} tickCount={6} />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" barSize={50}>
                {locationData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.complaints > 2 ? "#ef4444" : `rgba(37, 99, 235, ${0.4 + entry.complaints / 10})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>SLA by Location (On-Time vs Delayed)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={slaByLocation} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis allowDecimals={false} tickCount={6} />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" fill="#22c55e" name="On-Time" barSize={35} />
              <Bar dataKey="delayed" fill="#ef4444" name="Delayed" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>SLA by Department (On-Time vs Delayed)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={slaDept} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis allowDecimals={false} tickCount={6} />
              <Tooltip />
              <Legend />
              <Bar dataKey="onTime" fill="#22c55e" name="On-Time" barSize={35} />
              <Bar dataKey="delayed" fill="#ef4444" name="Delayed" barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer className="stats-footer">
        <p>© 2025 CivicPulse Hub – Analytics Insights</p>
      </footer>
    </div>
  );
}
