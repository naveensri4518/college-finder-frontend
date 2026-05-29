import { motion } from 'framer-motion';

const LOCATIONS = [
  '',
  'Coimbatore, Tamil Nadu',
  'Chennai, Tamil Nadu',
  'Tiruchirappalli, Tamil Nadu',
  'Madurai, Tamil Nadu',
  'Erode, Tamil Nadu',
  'Vellore, Tamil Nadu',
  'Virudhunagar, Tamil Nadu',
  'Kovilpatti, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'New Delhi, Delhi',
  'Bengaluru, Karnataka',
  'Manipal, Karnataka',
  'Pilani, Rajasthan',
  'Noida, Uttar Pradesh',
  'Kolkata, West Bengal',
];

const RATINGS = [
  { value: 0, label: 'Any Rating' },
  { value: 4.5, label: '4.5+ ⭐ Excellent' },
  { value: 4.0, label: '4.0+ ⭐ Very Good' },
  { value: 3.5, label: '3.5+ ⭐ Good' },
];

const FEES = [
  { value: null, label: 'Any Budget' },
  { value: 100000, label: 'Under ₹1L/yr' },
  { value: 200000, label: 'Under ₹2L/yr' },
  { value: 500000, label: 'Under ₹5L/yr' },
  { value: 1000000, label: 'Under ₹10L/yr' },
];

const hasActiveFilters = (filters) =>
  filters.location || filters.minRating > 0 || filters.maxFees;

export default function FilterPanel({ filters, onChange, onReset }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <motion.aside
      className="filter-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="filter-title">
        <span>🔧 Filters</span>
        {hasActiveFilters(filters) && (
          <button onClick={onReset}>Clear all</button>
        )}
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters(filters) && (
        <div style={{ marginBottom: 16 }}>
          {filters.location && <div className="filter-active-tag">📍 {filters.location.split(',')[0]}</div>}
          {filters.minRating > 0 && <div className="filter-active-tag" style={{ marginLeft: 4 }}>⭐ {filters.minRating}+</div>}
          {filters.maxFees && <div className="filter-active-tag" style={{ marginLeft: 4 }}>💰 ≤₹{(filters.maxFees/100000).toFixed(0)}L</div>}
        </div>
      )}

      {/* Location */}
      <div className="filter-group">
        <label>📍 Location</label>
        <select
          className="filter-select"
          value={filters.location || ''}
          onChange={e => handleChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {LOCATIONS.filter(Boolean).map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <label>⭐ Minimum Rating</label>
        <select
          className="filter-select"
          value={filters.minRating || 0}
          onChange={e => handleChange('minRating', parseFloat(e.target.value))}
        >
          {RATINGS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Fees */}
      <div className="filter-group">
        <label>💰 Maximum Fees</label>
        <select
          className="filter-select"
          value={filters.maxFees || ''}
          onChange={e => handleChange('maxFees', e.target.value ? parseInt(e.target.value) : null)}
        >
          {FEES.map(f => (
            <option key={f.value || 'all'} value={f.value || ''}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Sort hint */}
      <div style={{ padding: '12px', background: 'rgba(37,99,235,0.04)', borderRadius: 8, fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        💡 <strong>Tip:</strong> Results sorted by rating by default. Use filters to narrow down your choices.
      </div>
    </motion.aside>
  );
}
