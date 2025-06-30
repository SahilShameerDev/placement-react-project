import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="login-content">
        <div className="login-card fade-in">
          <div className="login-header">
            <h1 className="login-title">University Portal</h1>
            <p className="login-subtitle">Welcome back! Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message fade-in">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="demo-credentials">
              <h4>Demo Credentials:</h4>
              <div className="credential-grid">
                <div className="credential-item">
                  <strong>Admin:</strong> bfelce1@salon.com
                </div>
                <div className="credential-item">
                  <strong>Teacher:</strong> lcowpe0@marriott.com
                </div>
                <div className="credential-item">
                  <strong>Student:</strong> ltolchar3@msu.edu
                </div>
                <div className="credential-note">
                  <em>Password: Use the password from MOCK_DATA.json</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

// This is the login page component that allows users to sign in to the application.