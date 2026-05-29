import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, ...userData } = res.data;
      login(userData, token);
      navigate('/colleges');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="auth-logo">
          <div className="brand-icon">🎓</div>
          <h2>Welcome back</h2>
          <p>Sign in to your CollegeFinder account</p>
        </div>

        {error && (
          <motion.div className="error-alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className={`form-input ${error ? 'error' : ''}`} type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className={`form-input ${error ? 'error' : ''}`} type="password" name="password"
              placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?<Link to="/register"> Sign up for free</Link>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: 16, padding: 12, background: 'rgba(37,99,235,0.05)', borderRadius: 8, textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          💡 Try: <strong>test@college.com</strong> / <strong>test123</strong>
        </div>
      </motion.div>
    </div>
  );
}
