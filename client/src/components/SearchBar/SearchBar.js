import React, { useEffect, useRef, useState } from 'react';
import styles from './SearchBar.module.css';

/**
 * Debounced search box. Calls onSearch(value) after the user stops typing.
 */
function SearchBar({ value = '', onSearch, placeholder = 'Search products…', delay = 400 }) {
  const [text, setText] = useState(value);
  const timer = useRef(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (e) => {
    const next = e.target.value;
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next), delay);
  };

  const clear = () => {
    setText('');
    clearTimeout(timer.current);
    onSearch('');
  };

  return (
    <div className={styles.wrap}>
      <i className={`fa-solid fa-magnifying-glass ${styles.icon}`} aria-hidden="true" />
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search"
      />
      {text && (
        <button className={styles.clear} onClick={clear} aria-label="Clear search">
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
