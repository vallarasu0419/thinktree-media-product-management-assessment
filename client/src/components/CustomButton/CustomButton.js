import React from 'react';
import styles from './CustomButton.module.css';

/**
 * Reusable button.
 * props: variant (primary|secondary|danger|outline|ghost), size (sm|md|lg),
 * icon (font-awesome class), loading, block, type, onClick, disabled
 */
function CustomButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight = false,
  loading = false,
  block = false,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <i className={`fa-solid fa-spinner fa-spin ${styles.icon}`} aria-hidden="true" />}
      {!loading && icon && !iconRight && (
        <i className={`${icon} ${styles.icon}`} aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconRight && (
        <i className={`${icon} ${styles.icon}`} aria-hidden="true" />
      )}
    </button>
  );
}

export default CustomButton;
