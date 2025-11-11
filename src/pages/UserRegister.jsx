import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserRegister.css';

export default function UserRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'success' or 'error'
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:9090/api/users/register', form);
      if (res.data && res.data.status === 'success') {
        setMsgType('success');
        setMsg('Registration successful. Redirecting to login...');
        setTimeout(() => nav('/login'), 1200);
      } else {
        setMsgType('error');
        setMsg(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="form-page">
      <div className="card">
        <h2>User Registration</h2>
        <form onSubmit={submit}>
          <input
            className="input"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="submit" type="submit">Register</button>
        </form>
        <div className={`message ${msgType}`}>{msg}</div>
        <Link className="link" to="/login">Already have account? Login</Link>
      </div>
    </div>
  );
}
