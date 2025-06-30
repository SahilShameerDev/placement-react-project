import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <NavBar />
                  <Dashboard />
                  <Footer />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default App
