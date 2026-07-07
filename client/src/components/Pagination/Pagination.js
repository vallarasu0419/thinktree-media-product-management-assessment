import React from 'react';
import styles from './Pagination.module.css';

function getPages(current, total) {
  const pages = [];
  const add = (p) => pages.push(p);
  const range = 1;

  add(1);
  if (current - range > 2) add('…');
  for (let p = Math.max(2, current - range); p <= Math.min(total - 1, current + range); p += 1) {
    add(p);
  }
  if (current + range < total - 1) add('…');
  if (total > 1) add(total);

  return pages;
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = getPages(page, totalPages);

  return (
    <nav className={styles.wrap} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <i className="fa-solid fa-chevron-left" aria-hidden="true" />
      </button>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} className={styles.dots}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${p === page ? styles.active : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
