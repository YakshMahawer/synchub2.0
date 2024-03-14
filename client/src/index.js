import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import RegistrationPage from './components/RegistrationPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Project from './components/Project';
import WatchProject from './components/watchProject';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/minorProject" element={<RegistrationPage />} />
      <Route path="/" element={<DashboardPage/>} />
      <Route path="/teacher" element={<TeacherDashboard/>} />
      <Route path="/student" element={<StudentDashboard/>} />
      <Route path="/project" element={<Project/>} />
      <Route path="/watchProject" element={<WatchProject/>} />
    </Routes>
  </BrowserRouter>
);
