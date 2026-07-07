import React from 'react';
import styles from './CustomCard.module.css';

/**
 * Generic surface card. Use `hover` for interactive cards, `padded` for body padding.
 */
function CustomCard({ children, className = '', hover = false, padded = true, onClick }) {
  const classes = [
    styles.card,
    hover ? styles.hover : '',
    padded ? styles.padded : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

export default CustomCard;
