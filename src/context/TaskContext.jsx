import React, { createContext, useState, useContext, useEffect } from 'react'

const TaskContext = createContext()

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    setTasks(prev => [...prev, newTask])
  }

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
        : task
    ))
  }

  const getTasksForUser = (userId, userRole) => {
    return tasks.filter(task => {
      if (userRole === 'admin') return true
      if (userRole === 'teacher') {
        return task.assignedTo === userId || task.assignedBy === userId
      }
      return task.assignedTo === userId
    })
  }

  const getTasksByRole = (role) => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const usersByRole = users.filter(u => u.role === role)
    return tasks.filter(task => 
      usersByRole.some(user => user.id === task.assignedTo)
    )
  }

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasksForUser,
    getTasksByRole
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

// This context provides task management functionality, including adding, updating, deleting, and retrieving tasks.