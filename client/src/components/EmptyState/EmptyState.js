import React from 'react';
import styles from './EmptyState.module.css';

function EmptyState({ icon = 'fa-solid fa-box-open', title = 'Nothing here', message, children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.iconCircle}>
        <i className={icon} aria-hidden="true" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {children}
    </div>
  );
}

export default EmptyState;
