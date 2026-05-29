import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchSavedColleges } from '../services/api';
import CollegeCard from '../components/CollegeCard';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <motion.div className={`toast ${type}`}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}>
      {message}
    </motion.div>
  );
}

export default function SavedCollegesPage() {
  const { user, savedColleges, loadSavedColleges } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadSavedColleges().finally(() => setLoading(false));
  }, [user]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  return (
    <>
      <div className="toast-container">
        <AnimatePresence>
          {toast && <Toast key={toast.message} {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="saved-page-header page-top">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>❤️ My Saved Colleges</h1>
            <p>
              {loading
                ? 'Loading your saved colleges...'
                : savedColleges.length > 0
                ? `You have ${savedColleges.length} college${savedColleges.length > 1 ? 's' : ''} saved`
                : "You haven't saved any colleges yet"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="container">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner"/><p className="spinner-text">Loading saved colleges...</p></div>
          ) : savedColleges.length === 0 ? (
            <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="empty-icon">💔</div>
              <h3>No saved colleges yet</h3>
              <p>Browse colleges and click the ❤️ heart icon to save your favorites here.</p>
              <button className="btn-primary" onClick={() => navigate('/colleges')}>
                🔍 Explore Colleges
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="colleges-grid"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              <AnimatePresence>
                {savedColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onSaveToggle={() => loadSavedColleges()}
                    onToast={showToast}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
