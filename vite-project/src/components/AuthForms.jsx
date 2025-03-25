import React, { useState } from 'react';
import axios from 'axios';

const AuthForms = ({ onAuthSuccess, setShowForm }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const data = isLogin ? { email, password } : { email, password, username };

    axios
      .post(endpoint, data, { withCredentials: true })
      .then((response) => {
        onAuthSuccess(response.data.user);
        setShowForm(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="auth-section">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="form-submit-button">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>
      <button className="form-cancel-button" onClick={() => setShowForm(false)}>
        Cancel
      </button>
    </div>
  );
};

export default AuthForms;
