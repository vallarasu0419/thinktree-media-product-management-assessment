import React, { useId } from 'react';
import styles from './CustomInput.module.css';

/**
 * Reusable text input / textarea with label + error.
 * props: label, name, value, onChange, type, placeholder, error, required,
 * textarea (bool), rows, icon, ...rest
 */
function CustomInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error = '',
  required = false,
  textarea = false,
  rows = 4,
  icon,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const id = name || autoId;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.req}>*</span>}
        </label>
      )}

      <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
        {icon && <i className={`${icon} ${styles.icon}`} aria-hidden="true" />}
        {textarea ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={styles.control}
            {...rest}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={styles.control}
            {...rest}
          />
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default CustomInput;
