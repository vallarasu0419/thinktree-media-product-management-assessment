import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`app-container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <i className="fa-solid fa-cube" aria-hidden="true" />
          </span>
          <span>ProdManage</span>
        </div>
        <p className={styles.copy}>© {year} ProdManage.</p>
      </div>
    </footer>
  );
}

export default Footer;
