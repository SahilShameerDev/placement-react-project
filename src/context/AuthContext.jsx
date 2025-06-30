import React, { createContext, useState, useContext, useEffect } from 'react'
import MOCK_DATA from '../MOCK_DATA.json'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Initialize mock data and tasks in localStorage
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(MOCK_DATA))
    }
    
    if (!localStorage.getItem('tasks')) {
      const initialTasks = []
      localStorage.setItem('tasks', JSON.stringify(initialTasks))
    }
  }, [])

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || []
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const userWithoutPassword = { ...foundUser }
        delete userWithoutPassword.password
        
        setUser(userWithoutPassword)
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
        return { success: true }
      } else {
        return { success: false, message: 'Invalid email or password' }
      }
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
