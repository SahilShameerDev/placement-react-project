import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import '../pages/Dashboard.css'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const { tasks, getTasksForUser } = useTask()
  const [activeTab, setActiveTab] = useState('overview')
  const [userTasks, setUserTasks] = useState([])
  const [stats, setStats] = useState({
    assignedToMe: 0,
    assignedByMe: 0,
    completedByStudents: 0,
    pendingByStudents: 0
  })

  useEffect(() => {
    const myTasks = getTasksForUser(user?.id, user?.role)
    setUserTasks(myTasks)

    const assignedToMe = myTasks.filter(task => task.assignedTo === user?.id)
    const assignedByMe = myTasks.filter(task => task.assignedBy === user?.id)
    const completedByStudents = assignedByMe.filter(task => task.status === 'completed')
    const pendingByStudents = assignedByMe.filter(task => task.status === 'pending')

    setStats({
      assignedToMe: assignedToMe.length,
      assignedByMe: assignedByMe.length,
      completedByStudents: completedByStudents.length,
      pendingByStudents: pendingByStudents.length
    })
  }, [tasks, user, getTasksForUser])

  const myTasks = userTasks.filter(task => task.assignedTo === user?.id)
  const tasksIAssigned = userTasks.filter(task => task.assignedBy === user?.id)

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.assignedToMe}</div>
                <div className="stat-label">Tasks Assigned to Me</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.assignedByMe}</div>
                <div className="stat-label">Tasks I Assigned</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.completedByStudents}</div>
                <div className="stat-label">Completed by Students</div>
              </div>
              <div className="stat-card fade-in">
                <div className="stat-number">{stats.pendingByStudents}</div>
                <div className="stat-label">Pending by Students</div>
              </div>
            </div>
            
            <div className="dashboard-grid">
              <div className="card">
                <div className="section-title">My Tasks</div>
                <TaskList 
                  tasks={myTasks.slice(0, 3)} 
                  showAssignedBy={true}
                  canComplete={true}
                />
              </div>
              
              <div className="card">
                <div className="section-title">Recently Assigned</div>
                <TaskList 
                  tasks={tasksIAssigned.slice(0, 3)} 
                  showAssignedTo={true}
                  showProgress={true}
                />
              </div>
            </div>
          </div>
        )
      case 'mytasks':
        return (
          <div>
            <div className="section-title">My Tasks</div>
            <TaskList 
              tasks={myTasks} 
              showAssignedBy={true}
              canComplete={true}
            />
          </div>
        )
      case 'assign':
        return <TaskForm restrictToStudents={true} />
      case 'monitor':
        return (
          <div>
            <div className="section-title">Tasks I Assigned</div>
            <TaskList 
              tasks={tasksIAssigned} 
              showAssignedTo={true}
              showProgress={true}
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
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.first_name}! Manage your tasks and students.
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
            className={`tab-button ${activeTab === 'mytasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('mytasks')}
          >
            📝 My Tasks
          </button>
          <button 
            className={`tab-button ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => setActiveTab('assign')}
          >
            ➕ Assign to Students
          </button>
          <button 
            className={`tab-button ${activeTab === 'monitor' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitor')}
          >
            👁️ Monitor Students
          </button>
        </div>

        <div className="dashboard-tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
