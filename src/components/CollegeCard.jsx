import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveCollege, unsaveCollege } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CollegeCard({ college, rank, onSaveToggle, onToast }) {
  const { user, isCollegeSaved, addToCompare, removeFromCompare, isInCompare, loadSavedColleges } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const heartRef = useRef(null);

  const saved = isCollegeSaved(college.id);
  const inCompare = isInCompare(college.id);

  const handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      onToast?.('Please log in to save colleges', 'info');
      navigate('/login');
      return;
    }

    if (saving) return;
    setSaving(true);

    // Trigger heart animation
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 450);

    try {
      if (saved) {
        await unsaveCollege(college.id);
        onToast?.('Removed from saved colleges', 'info');
      } else {
        await saveCollege(college.id);
        onToast?.('❤️ College saved successfully!', 'success');
      }
      // Reload saved colleges in context
      await loadSavedColleges();
      onSaveToggle?.();
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.error || (saved ? 'Could not unsave college' : 'Could not save college');
      onToast?.(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(college.id);
      onToast?.(`Removed from comparison`, 'info');
    } else {
      addToCompare(college);
      onToast?.(`Added to comparison`, 'success');
    }
  };

  const formatFees = (fees) => {
    if (!fees && fees !== 0) return 'N/A';
    if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
    return `₹${(fees / 1000).toFixed(0)}K/yr`;
  };

  const formatPlacements = (p) => {
    if (!p && p !== 0) return 'N/A';
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)}L`;
    return `₹${(p / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      className="college-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/colleges/${college.id}`)}
    >
      {/* Image */}
      <div className="card-image-wrap">
        <img
          src={college.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format'}
          alt={college.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format';
          }}
        />

        {/* Rank badge */}
        {rank && (
          <div className="card-rank-badge">#{rank} Ranked</div>
        )}

        {/* Save Button */}
        <motion.button
          ref={heartRef}
          className={`card-save-btn ${saved ? 'saved' : ''} ${saving ? 'saving' : ''} ${heartAnim ? 'heart-anim' : ''}`}
          onClick={handleSave}
          title={saved ? 'Remove from saved' : 'Save college'}
          whileTap={{ scale: 0.85 }}
        >
          {saving ? '⏳' : saved ? '❤️' : '🤍'}
        </motion.button>
      </div>

      {/* Body */}
      <div className="card-body">
        <h3 className="card-name">{college.name}</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="card-location">
            <span className="card-location-icon">📍</span>
            {college.location || 'India'}
          </div>
          {college.rating && (
            <div className="card-rating">
              ⭐ {Number(college.rating).toFixed(1)}
            </div>
          )}
        </div>

        <div className="card-stats">
          <div className="card-stat">
            <div className="card-stat-value">{formatFees(college.fees)}</div>
            <div className="card-stat-label">Fees/yr</div>
          </div>
          <div className="card-stat">
            <div className="card-stat-value">{formatPlacements(college.placements)}</div>
            <div className="card-stat-label">Avg Package</div>
          </div>
        </div>

        {college.description && (
          <p className="card-description">{college.description}</p>
        )}

        <div className="card-actions">
          <Link
            to={`/colleges/${college.id}`}
            className="btn-card-view"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </Link>
          <button
            className={`btn-card-compare ${inCompare ? 'in-compare' : ''}`}
            onClick={handleCompare}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            {inCompare ? '✓ Added' : '⚖️'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
