import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/AdminDashboard'
import TeacherDashboard from '../components/TeacherDashboard'
import StudentDashboard from '../components/StudentDashboard'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard
