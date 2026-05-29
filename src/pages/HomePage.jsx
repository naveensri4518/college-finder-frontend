import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { fetchColleges } from '../services/api';
import CollegeCard from '../components/CollegeCard';

// ── Animated Counter ─────────────────────────────────────────
function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const step = end / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      className={`toast ${type}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {message}
    </motion.div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
        <div className="skeleton-line medium" />
      </div>
    </div>
  );
}

const TRENDING_COLLEGES = [
  { id: 1,  name: 'IIT Bombay', location: 'Mumbai, Maharashtra', rating: 4.9, fees: 250000, image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format' },
  { id: 3,  name: 'IIT Madras', location: 'Chennai, Tamil Nadu', rating: 4.9, fees: 220000, image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format' },
  { id: 13, name: 'IIM Bangalore', location: 'Bengaluru, Karnataka', rating: 4.9, fees: 2400000, image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&auto=format' },
  { id: 5,  name: 'NIT Trichy', location: 'Tiruchirappalli, Tamil Nadu', rating: 4.6, fees: 145000, image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&auto=format' },
  { id: 4,  name: 'BITS Pilani', location: 'Pilani, Rajasthan', rating: 4.7, fees: 450000, image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&auto=format' },
  { id: 11, name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', rating: 4.5, fees: 175000, image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format' },
];

const CATEGORIES = [
  { icon: '⚙️', name: 'Engineering', count: '42+ Colleges' },
  { icon: '💼', name: 'Management', count: '18+ Colleges' },
  { icon: '🔬', name: 'Sciences', count: '12+ Colleges' },
  { icon: '⚖️', name: 'Law', count: '8+ Colleges' },
  { icon: '🎨', name: 'Arts', count: '10+ Colleges' },
  { icon: '💊', name: 'Medicine', count: '6+ Colleges' },
  { icon: '🖥️', name: 'Computer Sci', count: '38+ Colleges' },
  { icon: '📐', name: 'Architecture', count: '5+ Colleges' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [topColleges, setTopColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);

  useEffect(() => {
    fetchColleges({ page: 0, size: 6 })
      .then(res => {
        const data = res.data;
        setTopColleges(Array.isArray(data) ? data.slice(0,6) : (data.colleges || []).slice(0,6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/colleges?search=${encodeURIComponent(search.trim())}`);
    else navigate('/colleges');
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const formatFees = (f) => f >= 100000 ? `₹${(f/100000).toFixed(0)}L/yr` : `₹${(f/1000).toFixed(0)}K/yr`;

  return (
    <>
      {/* Toast */}
      <div className="toast-container">
        {toast && <Toast key={Date.now()} {...toast} onClose={() => setToast(null)} />}
      </div>

      {/* ── HERO ── */}
      <section className="hero page-top" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              India's #1 College Discovery Platform
            </div>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Find Your{' '}
            <span className="hero-title-grad">Dream College</span>
            <br />with Confidence
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore 60+ top colleges across India. Compare fees, ratings, placements,
            and courses to make the best decision for your career.
          </motion.p>

          {/* Search Box */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="hero-search-box">
              <span className="hero-search-icon">🔍</span>
              <input
                className="hero-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search colleges by name, city, or course..."
              />
              <button type="submit" className="hero-search-btn">Search Colleges</button>
            </div>
          </motion.form>

          {/* Quick Tags */}
          <motion.div
            className="hero-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', marginRight: 4 }}>Trending:</span>
            {['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'PSG Tech', 'VIT Vellore', 'Anna University'].map(t => (
              <button key={t} className="hero-tag" onClick={() => { setSearch(t); navigate(`/colleges?search=${encodeURIComponent(t)}`); }}>
                {t}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <div className="stat-item">
              <div className="stat-value"><Counter end={62} suffix="+" /></div>
              <div className="stat-label">Colleges</div>
            </div>
            <div className="stat-item">
              <div className="stat-value"><Counter end={15} suffix="+" /></div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-value"><Counter end={50} suffix="K+" /></div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-value"><Counter end={98} suffix="%" /></div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRENDING COLLEGES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🔥 Trending Now</div>
            <h2 className="section-title">Top Colleges in India</h2>
            <p className="section-subtitle">Handpicked institutions with outstanding placements, faculty, and facilities</p>
          </div>

          <div className="trending-grid">
            {TRENDING_COLLEGES.map((college, i) => (
              <motion.div
                key={college.id}
                className="trending-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/colleges/${college.id}`)}
              >
                <img
                  className="trending-card-img"
                  src={college.image}
                  alt={college.name}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format'; }}
                />
                <div className="trending-card-body">
                  <div className="trending-card-name">{college.name}</div>
                  <div className="trending-card-loc">📍 {college.location}</div>
                  <div className="trending-card-footer">
                    <span className="trending-rating">⭐ {college.rating}</span>
                    <span className="trending-fees">{formatFees(college.fees)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/colleges" className="btn-primary">Explore All 62+ Colleges →</Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">📚 Categories</div>
            <h2 className="section-title">Browse by Field</h2>
            <p className="section-subtitle">Find colleges across different disciplines and specializations</p>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="category-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/colleges?search=${encodeURIComponent(cat.name)}`)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP CARDS FROM DB ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">⭐ Featured</div>
            <h2 className="section-title">Featured Colleges</h2>
            <p className="section-subtitle">Highest rated colleges on our platform based on real student data</p>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="colleges-grid">
              {topColleges.map((college, i) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  rank={i + 1}
                  onToast={showToast}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/colleges" className="btn-primary">See All Colleges →</Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">💡 Why Us</div>
            <h2 className="section-title">Everything You Need to Decide</h2>
            <p className="section-subtitle">We make college selection simple, data-driven, and stress-free</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { icon: '🔍', title: 'Smart Search', desc: 'Find colleges by name, city, course, or rating instantly' },
              { icon: '⚖️', title: 'Compare Colleges', desc: 'Side-by-side comparison of fees, placements, ratings and more' },
              { icon: '❤️', title: 'Save Favorites', desc: 'Create your shortlist and revisit your favorite colleges anytime' },
              { icon: '📊', title: 'Real Data', desc: 'Accurate fees, placement packages, and ratings from verified sources' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="newsletter-title">Stay Updated on Admissions 📬</h2>
            <p className="newsletter-subtitle">Get the latest news on college rankings, admission dates, and scholarship alerts</p>
            <div className="newsletter-form">
              <input
                className="newsletter-input"
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                className="newsletter-btn"
                onClick={() => { if (email) { setEmail(''); showToast('🎉 You\'re subscribed!', 'success'); } }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-logo">
                <span className="footer-brand-icon">🎓</span>
                College<span>Finder</span>
              </div>
              <p className="footer-desc">India's most trusted college discovery platform. Find, compare, and apply to your dream college with ease.</p>
            </div>
            <div>
              <div className="footer-col-title">Explore</div>
              <div className="footer-links">
                <Link to="/colleges" className="footer-link">All Colleges</Link>
                <Link to="/colleges?location=Coimbatore, Tamil Nadu" className="footer-link">Coimbatore Colleges</Link>
                <Link to="/colleges?location=Chennai, Tamil Nadu" className="footer-link">Chennai Colleges</Link>
                <Link to="/compare" className="footer-link">Compare Colleges</Link>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Account</div>
              <div className="footer-links">
                <Link to="/login" className="footer-link">Login</Link>
                <Link to="/register" className="footer-link">Register</Link>
                <Link to="/saved" className="footer-link">Saved Colleges</Link>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Popular</div>
              <div className="footer-links">
                {['IIT Bombay', 'NIT Trichy', 'PSG Tech', 'VIT Vellore', 'Anna University'].map(n => (
                  <span key={n} className="footer-link" style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/colleges?search=${encodeURIComponent(n)}`)}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 CollegeFinder. Built for internship demo 🚀</span>
            <span style={{ color: '#60a5fa' }}>Made with ❤️ using React + Spring Boot</span>
          </div>
        </div>
      </footer>
    </>
  );
}
