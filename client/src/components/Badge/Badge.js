import React from 'react';
import styles from './Badge.module.css';

/** tone: success | danger | warning | info | neutral | primary */
function Badge({ children, tone = 'neutral', icon, className = '' }) {
  const classes = [styles.badge, styles[tone] || styles.neutral, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes}>
      {icon && <i className={icon} aria-hidden="true" />}
      {children}
    </span>
  );
}

export default Badge;
