import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCollegeById, saveCollege, unsaveCollege } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3200); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`} style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999 }}>{message}</div>;
}

const TABS = ['Overview', 'Courses', 'Placements', 'Facilities', 'Reviews'];

export default function CollegeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCollegeSaved, loadSavedColleges, addToCompare, isInCompare, compareList } = useAuth();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [backendSaved, setBackendSaved] = useState(false);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  useEffect(() => {
    setLoading(true);
    fetchCollegeById(id)
      .then(res => {
        const d = res.data;
        setCollege(d.college || d);
        setBackendSaved(d.isSaved || false);
      })
      .catch(() => setError('College not found or server error.'))
      .finally(() => setLoading(false));
  }, [id]);

  const saved = isCollegeSaved(college?.id) || backendSaved;

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await unsaveCollege(college.id);
        setBackendSaved(false);
        showToast('Removed from saved colleges', 'info');
      } else {
        await saveCollege(college.id);
        setBackendSaved(true);
        showToast('❤️ College saved to favorites!', 'success');
      }
      await loadSavedColleges();
    } catch (e) {
      showToast(e.response?.data?.error || 'Could not update save status', 'error');
    } finally { setSaving(false); }
  };

  const handleCompare = () => {
    if (isInCompare(college?.id)) {
      navigate('/compare');
    } else {
      addToCompare(college);
      showToast('Added to comparison!', 'success');
    }
  };

  const fmt = (n) => n ? (n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`) : 'N/A';
  const fmtFees = (n) => n ? (n >= 100000 ? `₹${(n/100000).toFixed(1)}L/yr` : `₹${(n/1000).toFixed(0)}K/yr`) : 'N/A';

  if (loading) return (
    <div className="page-top" style={{ paddingTop: 120 }}>
      <div className="spinner-wrap"><div className="spinner" /><p className="spinner-text">Loading college details...</p></div>
    </div>
  );

  if (error || !college) return (
    <div className="page-top" style={{ paddingTop: 120 }}>
      <div className="container"><div className="error-alert">{error || 'College not found'}</div></div>
    </div>
  );

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero */}
      <div className="detail-hero page-top">
        <div className="container">
          <motion.div className="detail-hero-inner" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <img
              className="detail-college-img"
              src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format'}
              alt={college.name}
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format'; }}
            />
            <div className="detail-college-info">
              <h1 className="detail-college-name">{college.name}</h1>
              <div className="detail-location">📍 {college.location || 'India'}</div>

              <div className="detail-badges">
                {college.rating && <span className="detail-badge">⭐ {Number(college.rating).toFixed(1)} Rating</span>}
                <span className="detail-badge">💰 {fmtFees(college.fees)}</span>
                <span className="detail-badge">💼 {fmt(college.placements)} Avg Package</span>
              </div>

              <div className="detail-actions">
                <button
                  className={`btn-save-detail ${saved ? 'saved' : 'unsaved'}`}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? '⏳' : saved ? '❤️ Saved' : '🤍 Save College'}
                </button>
                <button className="btn-compare-detail" onClick={handleCompare}>
                  ⚖️ {isInCompare(college?.id) ? 'View Comparison' : 'Compare'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs-bar">
        <div className="container">
          <div className="detail-tabs">
            {TABS.map(tab => (
              <button key={tab} className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div className="container">
          {/* Quick Stats */}
          <div className="detail-quick-stats">
            {[
              { icon: '⭐', value: Number(college.rating || 0).toFixed(1), label: 'Rating' },
              { icon: '💰', value: fmtFees(college.fees), label: 'Annual Fees' },
              { icon: '💼', value: fmt(college.placements), label: 'Avg Package' },
              { icon: '📍', value: college.location?.split(',')[0] || 'India', label: 'Location' },
            ].map((s, i) => (
              <motion.div key={s.label} className="quick-stat-card"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <span className="quick-stat-icon">{s.icon}</span>
                <div className="quick-stat-value">{s.value}</div>
                <div className="quick-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {activeTab === 'Overview' && (
                <div className="detail-card">
                  <h3 className="detail-section-title">About {college.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    {college.description || 'No description available for this college.'}
                  </p>
                </div>
              )}

              {activeTab === 'Courses' && (
                <div className="detail-card">
                  <h3 className="detail-section-title">Programs Offered</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                    {(college.courses || 'B.Tech, M.Tech, MBA').split(',').map(c => (
                      <span key={c.trim()} style={{
                        padding: '6px 14px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.15)',
                        fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500
                      }}>{c.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Placements' && (
                <div className="detail-card">
                  <h3 className="detail-section-title">Placement Highlights</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 16 }}>
                    {[
                      { label: 'Average Package', value: fmt(college.placements) },
                      { label: 'Highest Package', value: fmt(college.placements * 2.5) },
                      { label: 'Placement Rate', value: '85%+' },
                      { label: 'Top Recruiters', value: 'TCS, Infosys, Wipro' },
                    ].map(item => (
                      <div key={item.label} style={{ background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)', marginBottom: 4 }}>{item.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Facilities' && (
                <div className="detail-card">
                  <h3 className="detail-section-title">Campus Facilities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                    {(college.facilities || 'Library, Hostels, Labs, Sports, Cafeteria').split(',').map(f => (
                      <span key={f.trim()} style={{
                        padding: '6px 14px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)',
                        fontSize: '0.875rem', color: '#059669', fontWeight: 500
                      }}>✓ {f.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Reviews' && (
                <div className="detail-card">
                  <h3 className="detail-section-title">Student Reviews</h3>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.8, marginBottom: 16 }}>
                    "{college.reviews || 'This college offers great academics and placement opportunities. Highly recommended for aspiring engineers.'}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {'⭐'.repeat(Math.round(college.rating || 4))}
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Number(college.rating || 4).toFixed(1)}/5</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
