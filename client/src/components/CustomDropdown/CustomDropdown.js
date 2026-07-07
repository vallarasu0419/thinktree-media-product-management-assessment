import React, { useId } from 'react';
import styles from './CustomDropdown.module.css';

/**
 * Reusable select.
 * props: label, name, value, onChange, options [{value,label}], placeholder,
 * error, required, icon
 */
function CustomDropdown({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  error = '',
  required = false,
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
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={styles.control}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <i className={`fa-solid fa-chevron-down ${styles.caret}`} aria-hidden="true" />
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default CustomDropdown;
