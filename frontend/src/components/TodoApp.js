import React, { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos();
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const response = await createTodo(todoData);
      setTodos([response.data, ...todos]);
      return true;
    } catch (err) {
      setError('Failed to add todo');
      return false;
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const updateTodoItem = async (id, updatedData) => {
    try {
      const response = await updateTodo(id, updatedData);
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      return true;
    } catch (err) {
      setError('Failed to update todo');
      return false;
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      setShowConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) {
      setError('No completed todos to clear');
      setTimeout(() => setError(null), 2000);
      return;
    }
    
    if (window.confirm(`Delete ${completedTodos.length} completed todo(s)?`)) {
      for (let todo of completedTodos) {
        await deleteTodo(todo._id);
      }
      loadTodos();
    }
  };

  const getFilteredAndSearchedTodos = () => {
    let filtered = todos;
    
    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  const filteredTodos = getFilteredAndSearchedTodos();

  return (
    <div className="todo-app">
      <h1>
        📝 Todo App
        <span className="app-subtitle">MERN Stack</span>
      </h1>
      
      <TodoForm onSubmit={addTodo} />
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="todo-stats">
        <span>📊 Total: {stats.total}</span>
        <span>⏳ Active: {stats.active}</span>
        <span>✅ Completed: {stats.completed}</span>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search todos by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="clear-search">
            ✖
          </button>
        )}
      </div>

      <div className="filter-buttons">
        <button 
          onClick={() => setFilter('all')} 
          className={filter === 'all' ? 'active' : ''}
        >
          All ({stats.total})
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={filter === 'active' ? 'active' : ''}
        >
          Active ({stats.active})
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed ({stats.completed})
        </button>
        {stats.completed > 0 && (
          <button onClick={clearCompleted} className="clear-completed-btn">
            🗑️ Clear Completed
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading todos...
        </div>
      ) : (
        <>
          <TodoList 
            todos={filteredTodos}
            onToggle={toggleComplete}
            onUpdate={updateTodoItem}
            onDelete={(id) => setShowConfirmDelete(id)}
          />
          
          {filteredTodos.length === 0 && (
            <div className="empty-state">
              {searchTerm ? (
                <>🔍 No todos matching "{searchTerm}"</>
              ) : (
                <>🎉 No todos! Add one above</>
              )}
            </div>
          )}
        </>
      )}

      {/* Custom Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Todo</h3>
            <p>Are you sure you want to delete this todo?</p>
            <div className="modal-buttons">
              <button onClick={() => removeTodo(showConfirmDelete)} className="modal-confirm">
                Yes, Delete
              </button>
              <button onClick={() => setShowConfirmDelete(null)} className="modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;