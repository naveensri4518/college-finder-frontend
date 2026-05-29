import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CollegeListPage from './pages/CollegeListPage';
import CollegeDetailPage from './pages/CollegeDetailPage';
import CompareCollegesPage from './pages/CompareCollegesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedCollegesPage from './pages/SavedCollegesPage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/colleges"  element={<CollegeListPage />} />
          <Route path="/colleges/:id" element={<CollegeDetailPage />} />
          <Route path="/compare"   element={<CompareCollegesPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/saved"     element={<SavedCollegesPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
