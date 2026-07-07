import React from 'react';
import styles from './Loader.module.css';

function Loader({ label = 'Loading…', fullscreen = false }) {
  return (
    <div className={fullscreen ? styles.fullscreen : styles.wrap}>
      <span className={styles.spinner} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}

export default Loader;
