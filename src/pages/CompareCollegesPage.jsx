import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { compareColleges } from '../services/api';
import { useState, useEffect } from 'react';

export default function CompareCollegesPage() {
  const { compareList, removeFromCompare } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compareList.length < 2) { setData([]); return; }
    setLoading(true);
    compareColleges(compareList.map(c => c.id))
      .then(res => {
        const d = res.data;
        setData(Array.isArray(d) ? d : []);
      })
      .catch(() => setData(compareList))
      .finally(() => setLoading(false));
  }, [compareList]);

  const displayed = data.length > 0 ? data : compareList;

  const fmt = (n) => n ? (n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`) : 'N/A';
  const fmtFees = (n) => n ? (n >= 100000 ? `₹${(n/100000).toFixed(1)}L/yr` : `₹${(n/1000).toFixed(0)}K/yr`) : 'N/A';

  const getBest = (key, lowerIsBetter = false) => {
    if (displayed.length < 2) return null;
    const vals = displayed.map(c => parseFloat(c[key]) || 0);
    const best = lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
    return best;
  };

  const isBest = (college, key, lowerIsBetter = false) => {
    const best = getBest(key, lowerIsBetter);
    return best !== null && parseFloat(college[key]) === best;
  };

  const rows = [
    { label: '📍 Location', render: c => c.location || 'N/A', key: null },
    { label: '⭐ Rating', render: c => Number(c.rating||0).toFixed(1), key: 'rating' },
    { label: '💰 Annual Fees', render: c => fmtFees(c.fees), key: 'fees', lower: true },
    { label: '💼 Avg Package', render: c => fmt(c.placements), key: 'placements' },
    { label: '📚 Courses', render: c => (c.courses || 'N/A').split(',').slice(0,3).join(', '), key: null },
    { label: '🏢 Facilities', render: c => (c.facilities || 'N/A').split(',').slice(0,3).join(', '), key: null },
  ];

  return (
    <>
      <div className="compare-page-header page-top">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>⚖️ Compare Colleges</h1>
            <p>Side-by-side comparison to help you make the best decision</p>
          </motion.div>
        </div>
      </div>

      <div className="compare-body">
        <div className="container">
          {compareList.length < 2 ? (
            <div className="empty-state">
              <div className="empty-icon">⚖️</div>
              <h3>Add colleges to compare</h3>
              <p>Browse colleges and click ⚖️ on at least 2 college cards to start comparing.</p>
              <Link to="/colleges" className="btn-primary">Browse Colleges</Link>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}>Comparison</th>
                      {displayed.map(c => (
                        <th key={c.id}>
                          <div className="compare-col-head">
                            <img
                              className="compare-col-img"
                              src={c.image || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format'}
                              alt={c.name}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format'; }}
                            />
                            <div className="compare-col-name">{c.name}</div>
                            <div className="compare-col-loc">📍 {c.location || 'India'}</div>
                            <button className="compare-remove-btn" onClick={() => removeFromCompare(c.id)}>
                              ✕ Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        {displayed.map(c => (
                          <td key={c.id}>
                            {row.key && isBest(c, row.key, row.lower) ? (
                              <span className="compare-best">{row.render(c)} ✓</span>
                            ) : row.render(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td>🔗 Action</td>
                      {displayed.map(c => (
                        <td key={c.id}>
                          <button className="btn-primary" style={{ fontSize: '0.8125rem', padding: '8px 14px' }}
                            onClick={() => navigate(`/colleges/${c.id}`)}>
                            View Details
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {compareList.length < 3 && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
                    You can compare up to 3 colleges. Add one more?
                  </p>
                  <Link to="/colleges" className="btn-primary">+ Add Another College</Link>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
