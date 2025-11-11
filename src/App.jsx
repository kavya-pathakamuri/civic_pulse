import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import AdminLogin from './pages/AdminLogin'
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/DashBoard";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import OfficerLogin from "./pages/OfficerLogin";
import OfficerDashboard from "./pages/OfficerDashboard";
import AdminStatistics from "./pages/AdminStatistics";


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/register' element={<UserRegister/>} />
      <Route path='/login' element={<UserLogin/>} />
      <Route path='/admin' element={<AdminLogin/>} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-home" element={<AdminHome />} /> 
      <Route path='/admin-dashboard' element={<AdminDashboard />} /> 
      <Route path="/officer" element={<OfficerLogin />} />
      <Route path="/officer-dashboard" element={<OfficerDashboard />} />
      <Route path="/admin-statistics" element={<AdminStatistics />} />
    </Routes>
  )
}
