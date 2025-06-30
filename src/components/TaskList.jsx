import React from 'react'
import { useTask } from '../context/TaskContext'

const TaskList = ({ 
  tasks, 
  showAssignedTo = false, 
  showAssignedBy = false,
  canComplete = false,
  showProgress = false,
  showDueDate = false,
  showCompletedDate = false,
  highlightOverdue = false,
  isAdmin = false 
}) => {
  const { completeTask, deleteTask } = useTask()

  const handleCompleteTask = (taskId) => {
    const taskElement = document.getElementById(`task-${taskId}`)
    if (taskElement) {
      taskElement.classList.add('task-completing')
      setTimeout(() => {
        completeTask(taskId)
      }, 300)
    } else {
      completeTask(taskId)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc3545'
      case 'high': return '#fd7e14'
      case 'medium': return '#ffc107'
      case 'low': return '#28a745'
      default: return '#6c757d'
    }
  }

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false
    return new Date(dueDate) < new Date()
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <div className="empty-state-text">No tasks found</div>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div 
          key={task.id}
          id={`task-${task.id}`}
          className={`task-item ${highlightOverdue && isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
        >
          <div className="task-header">
            <div className="task-main">
              <div className="task-title-row">
                <h3 className="task-title">{task.title}</h3>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>
              
              <div className="task-meta">
                {showAssignedTo && task.assignedToName && (
                  <span>📤 Assigned to: {task.assignedToName}</span>
                )}
                {showAssignedBy && task.assignedByName && (
                  <span>👤 Assigned by: {task.assignedByName}</span>
                )}
                {showDueDate && task.dueDate && (
                  <span className={isOverdue(task.dueDate, task.status) ? 'overdue-text' : ''}>
                    ⏰ Due: {formatDate(task.dueDate)}
                  </span>
                )}
                {showCompletedDate && task.completedAt && (
                  <span>✅ Completed: {formatDate(task.completedAt)}</span>
                )}
                <span>📅 Created: {formatDate(task.createdAt)}</span>
              </div>
            </div>

            <div className="task-status">
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
            </div>
          </div>

          <div className="task-description">
            {task.description}
          </div>

          <div className="task-actions">
            {canComplete && task.status === 'pending' && (
              <button 
                onClick={() => handleCompleteTask(task.id)}
                className="btn btn-primary btn-sm"
              >
                ✅ Mark Complete
              </button>
            )}
            
            {showProgress && (
              <div className="task-progress">
                <span className="progress-text">
                  Status: <strong>{task.status}</strong>
                  {task.completedAt && (
                    <span className="completion-time">
                      {' '}(Completed: {formatDate(task.completedAt)})
                    </span>
                  )}
                </span>
              </div>
            )}

            {isAdmin && (
              <button 
                onClick={() => deleteTask(task.id)}
                className="btn btn-danger btn-sm"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList
