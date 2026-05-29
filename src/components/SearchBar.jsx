import { useEffect, useRef, useState } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search colleges...' }) {
  const [local, setLocal] = useState(value || '');
  const timerRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setLocal(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 400);
  };

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search colleges"
      />
    </div>
  );
}
