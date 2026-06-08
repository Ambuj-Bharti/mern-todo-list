import React, { useState } from 'react';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    
    const success = await onUpdate(todo._id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  const getPriorityColor = () => {
    switch(todo.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityEmoji = () => {
    switch(todo.priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            placeholder="Title"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            placeholder="Description (optional)"
            rows="2"
          />
          <select 
            value={editPriority} 
            onChange={(e) => setEditPriority(e.target.value)}
            className="edit-select"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
          <div className="edit-buttons">
            <button onClick={handleUpdate} className="save-btn">💾 Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">❌ Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${getPriorityColor()}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id, todo.completed)}
        className="todo-checkbox"
      />
      
      <div className="todo-content">
        <div className="todo-header">
          <span className="priority-badge">
            {getPriorityEmoji()} {todo.priority}
          </span>
          <span className="todo-date">
            📅 {formatDate(todo.createdAt)}
          </span>
        </div>
        <h3 className="todo-title">{todo.title}</h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
      </div>
      
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn" title="Edit">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(todo._id)} className="delete-btn" title="Delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;