import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSavedColleges } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [savedColleges, setSavedColleges] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Load persisted user on mount ──────────────────────────
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const raw = localStorage.getItem('user');
      if (token && raw) setUser(JSON.parse(raw));
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── Load saved colleges whenever user changes ─────────────
  useEffect(() => {
    if (user) loadSavedColleges();
    else setSavedColleges([]);
  }, [user?.userId]);  // Only re-run when user ID changes

  const loadSavedColleges = useCallback(async () => {
    try {
      const res = await fetchSavedColleges();
      const data = res.data;
      // Backend may return array or paginated object
      const list = Array.isArray(data) ? data : (data.colleges || []);
      setSavedColleges(list);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired — log out
        setSavedColleges([]);
      }
    }
  }, []);

  // ── Auth ─────────────────────────────────────────────────
  const login = (userData, token) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (e) { console.error('Persist login failed:', e); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSavedColleges([]);
    setCompareList([]);
  };

  // ── Saved ────────────────────────────────────────────────
  // Check by id (ensure type coercion safety)
  const isCollegeSaved = (id) =>
    savedColleges.some(c => String(c.id) === String(id));

  // ── Compare ───────────────────────────────────────────────
  const addToCompare = (college) => {
    setCompareList(prev => {
      if (prev.find(c => c.id === college.id)) return prev;
      if (prev.length >= 3) {
        alert('You can compare at most 3 colleges at a time. Remove one first.');
        return prev;
      }
      return [...prev, college];
    });
  };

  const removeFromCompare = (id) =>
    setCompareList(prev => prev.filter(c => c.id !== id));

  const isInCompare = (id) => compareList.some(c => c.id === id);

  if (authLoading) return null;

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      savedColleges, setSavedColleges, loadSavedColleges, isCollegeSaved,
      compareList, addToCompare, removeFromCompare, isInCompare,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
