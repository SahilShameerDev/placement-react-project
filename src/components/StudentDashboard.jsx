import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'
import TaskList from './TaskList'
import '../pages/Dashboard.css'

const StudentDashboard = () => {
  const { user } = useAuth()
  const { tasks, getTasksForUser } = useTask()
  const [activeTab, setActiveTab] = useState('pending')
  const [userTasks, setUserTasks] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  })

  useEffect(() => {
    const myTasks = getTasksForUser(user?.id, user?.role)
    setUserTasks(myTasks)

    const completed = myTasks.filter(task => task.status === 'completed')
    const pending = myTasks.filter(task => task.status === 'pending')
    const overdue = myTasks.filter(task => {
      if (task.dueDate && task.status === 'pending') {
        return new Date(task.dueDate) < new Date()
      }
      return false
    })

    setStats({
      totalTasks: myTasks.length,
      completedTasks: completed.length,
      pendingTasks: pending.length,
      overdueTasks: overdue.length
    })
  }, [tasks, user, getTasksForUser])

  const pendingTasks = userTasks.filter(task => task.status === 'pending')
  const completedTasks = userTasks.filter(task => task.status === 'completed')
  const overdueTasks = userTasks.filter(task => {
    if (task.dueDate && task.status === 'pending') {
      return new Date(task.dueDate) < new Date()
    }
    return false
  })

  const renderContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <div>
            <div className="section-title">Pending Tasks</div>
            <TaskList 
              tasks={pendingTasks} 
              showAssignedBy={true}
              canComplete={true}
              showDueDate={true}
            />
          </div>
        )
      case 'completed':
        return (
          <div>
            <div className="section-title">Completed Tasks</div>
            <TaskList 
              tasks={completedTasks} 
              showAssignedBy={true}
              showCompletedDate={true}
            />
          </div>
        )
      case 'overdue':
        return (
          <div>
            <div className="section-title">Overdue Tasks</div>
            <TaskList 
              tasks={overdueTasks} 
              showAssignedBy={true}
              canComplete={true}
              showDueDate={true}
              highlightOverdue={true}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header fade-in">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.first_name}! Here are your assignments.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card fade-in">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-number">{stats.pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card fade-in">
            <div className="stat-number">{stats.overdueTasks}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            ⏳ Pending Tasks ({stats.pendingTasks})
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Completed ({stats.completedTasks})
          </button>
          <button 
            className={`tab-button ${activeTab === 'overdue' ? 'active' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            ⚠️ Overdue ({stats.overdueTasks})
          </button>
        </div>

        <div className="dashboard-tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard

// This component represents the student dashboard, displaying tasks and statistics based on the user's role.