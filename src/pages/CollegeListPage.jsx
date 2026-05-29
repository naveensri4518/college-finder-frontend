import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchColleges } from '../services/api';
import CollegeCard from '../components/CollegeCard';
import FilterPanel from '../components/FilterPanel';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <motion.div className={`toast ${type}`}
      initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}>
      {message}
    </motion.div>
  );
}

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

const DEFAULT_FILTERS = { location: '', minRating: 0, maxFees: null };

export default function CollegeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    location: searchParams.get('location') || '',
  });
  const [toast, setToast] = useState(null);
  const PAGE_SIZE = 9;

  const loadColleges = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { page, size: PAGE_SIZE };
      if (search?.trim()) params.search = search.trim();
      if (filters.location?.trim()) params.location = filters.location.trim();
      if (filters.minRating > 0) params.minRating = filters.minRating;
      if (filters.maxFees && filters.maxFees > 0 && filters.maxFees < 3000000) params.maxFees = filters.maxFees;

      const res = await fetchColleges(params);
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.colleges || []);
      setColleges(list);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || list.length);
    } catch (err) {
      console.error(err);
      setError(
        err.code === 'ERR_NETWORK'
          ? '⚠️ Cannot connect to backend. Make sure Spring Boot is running on port 8080.'
          : err.response?.data?.error || 'Failed to load colleges. Please try again.'
      );
      setColleges([]);
    } finally { setLoading(false); }
  }, [page, search, filters]);

  useEffect(() => { loadColleges(); }, [loadColleges]);

  const handleSearch = (val) => { setSearch(val); setPage(0); setSearchParams(val ? { search: val } : {}); };
  const handleFilter = (f) => { setFilters(f); setPage(0); };
  const handleReset = () => { setFilters(DEFAULT_FILTERS); setSearch(''); setPage(0); setSearchParams({}); };
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  // Pagination numbers
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i);

  return (
    <>
      <div className="toast-container">
        <AnimatePresence>
          {toast && <Toast key={toast.message} {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="list-page-header page-top">
        <div className="container">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            🏫 Explore Colleges
          </motion.h2>

          {/* Search */}
          <motion.div className="search-wrap" style={{ maxWidth: 640 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by college name, city, or keyword..."
            />
            {search && (
              <button className="search-clear" onClick={() => handleSearch('')}>✕</button>
            )}
          </motion.div>

          {!loading && (
            <span className="results-count">
              {totalElements > 0 ? `${totalElements} college${totalElements !== 1 ? 's' : ''} found` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="list-page-body">
        <div className="container">
          <div className="list-page-layout">
            {/* Filter Sidebar */}
            <FilterPanel filters={filters} onChange={handleFilter} onReset={handleReset} />

            {/* Cards */}
            <div>
              {loading ? (
                <div className="skeleton-grid">
                  {[...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : error ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="error-alert">{error}</div>
                  <button className="btn-primary" style={{ marginTop: 16 }} onClick={loadColleges}>🔄 Retry</button>
                </motion.div>
              ) : colleges.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No colleges found</h3>
                  <p>Try adjusting your search or clearing the filters.</p>
                  <button className="btn-primary" onClick={handleReset}>Clear All Filters</button>
                </div>
              ) : (
                <>
                  <motion.div
                    className="colleges-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
                  >
                    <AnimatePresence>
                      {colleges.map((c, i) => (
                        <CollegeCard key={c.id} college={c} rank={page * PAGE_SIZE + i + 1} onToast={showToast} />
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button className="page-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>‹</button>
                      {pages.map(p => (
                        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`}
                          onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                          {p + 1}
                        </button>
                      ))}
                      <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>›</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
