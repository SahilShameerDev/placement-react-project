import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import UserManagement from './UserManagement'
import '../pages/Dashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const { tasks, getTasksByRole } = useTask()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    studentTasks: 0,
    teacherTasks: 0
  })

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const studentTasks = getTasksByRole('student')
    const teacherTasks = getTasksByRole('teacher')
    const completedTasks = tasks.filter(task => task.status === 'completed')
    const pendingTasks = tasks.filter(task => task.status === 'pending')

    setStats({
      totalUsers: users.length,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      studentTasks: studentTasks.length,
      teacherTasks: teacherTasks.length
    })
  }, [tasks, getTasksByRole])

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.pendingTasks}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.studentTasks}</div>
                <div className="stat-label">Student Tasks</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.teacherTasks}</div>
                <div className="stat-label">Teacher Tasks</div>
              </div>
            </div>
            
            <div className="section-title">Recent Activities</div>
            <TaskList 
              tasks={tasks.slice(0, 5)} 
              showAssignedTo={true}
              isAdmin={true}
            />
          </div>
        )
      case 'assign':
        return <TaskForm />
      case 'manage':
        return <TaskList tasks={tasks} showAssignedTo={true} isAdmin={true} />
      case 'users':
        return <UserManagement />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.first_name}! Manage your university system.
          </p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => setActiveTab('assign')}
          >
            ➕ Assign Task
          </button>
          <button 
            className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Manage Tasks
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </div>

        <div className="dashboard-tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
