import React, { useState } from 'react';
import loginImg from '../assets/login.jpg';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        if (data.user.role === 'STUDENT') {
          navigate('/student-dashboard');
        } else if (data.user.role === 'INSTRUCTOR') {
          navigate('/instructor-dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-grid">
      <div className="app-img">
        <img src={loginImg} alt="" />
      </div>
      <div className="form-container">
        <form className="form-box" onSubmit={handleSubmit}>
          <h2 className="form-title">SIGN IN</h2>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-row">
            <p className="form-row"><input type="checkbox" /> Remember Me</p>
            <p>Forgot Password</p>
          </div>
          <button className="form-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'SIGNIN'}</button>
          <p className="form-footer">Don't have an account? <a href="/signup" className="form-link">Sign up</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
