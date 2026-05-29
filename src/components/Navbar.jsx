import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, compareList } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll to toggle glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  // On hero pages, start transparent
  const isHeroPage = ['/', '/colleges'].includes(location.pathname);
  const navClass = scrolled || !isHeroPage ? 'navbar-glass' : 'navbar-transparent';

  return (
    <>
      <nav className={`navbar ${navClass}`}>
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="nav-brand">
            <div className="nav-brand-icon">🎓</div>
            <span className="nav-brand-text">
              College<span>Finder</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/colleges" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Colleges</NavLink>
            <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Compare</NavLink>
            {user && (
              <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Saved ❤️</NavLink>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {compareList.length > 0 && (
              <Link to="/compare" className="nav-compare-badge">
                ⚖️ Compare
                <span className="compare-count">{compareList.length}</span>
              </Link>
            )}

            {user ? (
              <>
                <Link to="/saved" className="nav-saved-link" title="Saved Colleges">❤️</Link>
                <div className="nav-user-btn" title={user.email}>
                  <div className="nav-avatar">{(user.name || user.email || 'U')[0].toUpperCase()}</div>
                  <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button className="btn-nav-logout" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-nav-login">Log in</Link>
                <Link to="/register" className="btn-nav-signup">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.95)', zIndex: 999, padding: '80px 24px' }}
            onClick={() => setMenuOpen(false)}
          >
            <div className="nav-links" style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Link to="/" style={{ color: 'white', fontSize: '1.25rem' }}>Home</Link>
              <Link to="/colleges" style={{ color: 'white', fontSize: '1.25rem' }}>Colleges</Link>
              <Link to="/compare" style={{ color: 'white', fontSize: '1.25rem' }}>Compare</Link>
              {user && <Link to="/saved" style={{ color: 'white', fontSize: '1.25rem' }}>Saved ❤️</Link>}
              {!user && <Link to="/login" style={{ color: 'white', fontSize: '1.25rem' }}>Log in</Link>}
              {!user && <Link to="/register" style={{ color: 'white', fontSize: '1.25rem' }}>Sign up</Link>}
              {user && <button onClick={handleLogout} style={{ color: '#f87171', fontSize: '1rem' }}>Sign out</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
