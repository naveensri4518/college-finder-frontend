import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setApiError(''); setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      const { token, ...userData } = res.data;
      login(userData, token);
      navigate('/colleges');
    } catch (err) {
      setApiError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="auth-logo">
          <div className="brand-icon">🎓</div>
          <h2>Create account</h2>
          <p>Join thousands of students on CollegeFinder</p>
        </div>

        {apiError && (
          <motion.div className="error-alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
            ⚠️ {apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className={`form-input ${errors.name ? 'error' : ''}`} type="text" name="name"
              placeholder="John Doe" value={form.name} onChange={handleChange} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password"
              placeholder="At least 6 characters" value={form.password} onChange={handleChange} />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className={`form-input ${errors.confirm ? 'error' : ''}`} type="password" name="confirm"
              placeholder="Re-enter password" value={form.confirm} onChange={handleChange} />
            {errors.confirm && <div className="field-error">{errors.confirm}</div>}
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?<Link to="/login"> Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
