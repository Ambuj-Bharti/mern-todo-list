import React, { useState } from 'react';

const TodoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setSubmitting(true);
    const success = await onSubmit({ 
      title, 
      description, 
      priority 
    });
    
    if (success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
    setSubmitting(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
          disabled={submitting}
        />
      </div>
      
      <div className="form-group">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-textarea"
          rows="2"
          disabled={submitting}
        />
      </div>
      
      <div className="form-row">
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
          disabled={submitting}
        >
          <option value="low">🟢 Low Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="high">🔴 High Priority</option>
        </select>
        
        <button type="submit" className="add-button" disabled={submitting}>
          {submitting ? 'Adding...' : '+ Add Todo'}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;