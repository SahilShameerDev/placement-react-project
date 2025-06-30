import React, { useState, useEffect } from 'react'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || []
    setUsers(storedUsers)
    setFilteredUsers(storedUsers)
  }, [])

  useEffect(() => {
    let filtered = users

    // Filter by role
    if (filter !== 'all') {
      filtered = filtered.filter(user => user.role === filter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }, [users, filter, searchTerm])

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545'
      case 'teacher': return '#28a745'
      case 'student': return '#007bff'
      default: return '#6c757d'
    }
  }

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})
    return stats
  }

  const stats = getRoleStats()

  return (
    <div className="user-management">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.admin || 0}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.teacher || 0}</div>
          <div className="stat-label">Teachers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.student || 0}</div>
          <div className="stat-label">Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
      </div>

      <div className="user-filters">
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
            
            <div className="user-info">
              <h3 className="user-name">
                {user.first_name} {user.last_name}
              </h3>
              <p className="user-email">{user.email}</p>
              
              <span 
                className="role-badge"
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {user.role}
              </span>
            </div>

            <div className="user-stats">
              <div className="user-stat">
                <span className="stat-label">Gender:</span>
                <span className="stat-value">{user.gender}</span>
              </div>
              <div className="user-stat">
                <span className="stat-label">ID:</span>
                <span className="stat-value">#{user.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-text">No users found</div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
