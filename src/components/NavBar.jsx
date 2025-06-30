import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleDisplay = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2 className="navbar-logo">University Portal</h2>
        <span className="navbar-tagline">Excellence in Education</span>
      </div>
      
      <div className="navbar-center">
        <div className="navbar-user-info">
          <span className="user-greeting">Welcome back,</span>
          <span className="user-name">{user?.first_name} {user?.last_name}</span>
          <span className="user-role">{getRoleDisplay(user?.role)}</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button 
          onClick={handleLogout}
          className="btn btn-secondary navbar-logout"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default NavBar