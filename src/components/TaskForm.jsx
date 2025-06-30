import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTask } from '../context/TaskContext'

const TaskForm = ({ restrictToStudents = false }) => {
  const { user } = useAuth()
  const { addTask } = useTask()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium'
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    
    if (restrictToStudents) {
      // Teachers can only assign to students
      setUsers(allUsers.filter(u => u.role === 'student'))
    } else if (user?.role === 'admin') {
      // Admins can assign to teachers and students
      setUsers(allUsers.filter(u => u.role !== 'admin'))
    }
  }, [restrictToStudents, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const task = {
        ...formData,
        assignedBy: user?.id,
        assignedByName: `${user?.first_name} ${user?.last_name}`,
        assignedToName: users.find(u => u.id === parseInt(formData.assignedTo))?.first_name + ' ' + 
                       users.find(u => u.id === parseInt(formData.assignedTo))?.last_name
      }

      addTask(task)
      
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="task-form-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            {restrictToStudents ? 'Assign Task to Student' : 'Create New Task'}
          </h2>
        </div>

        {success && (
          <div className="success-message fade-in">
            Task assigned successfully! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter task description and requirements"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assign To *</label>
              <select
                id="assignedTo"
                name="assignedTo"
                className="form-select"
                value={formData.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Select user...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
