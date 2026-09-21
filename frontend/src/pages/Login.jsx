import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', color: 'var(--primary)', marginBottom: '15px' }}>
            <LogIn size={30} />
          </div>
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to the Visitor Pass System</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>
          <p>Demo accounts:</p>
          <p style={{ color: 'var(--text-muted)' }}>admin@test.com | security@test.com | host@test.com</p>
          <p style={{ color: 'var(--text-muted)' }}>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
