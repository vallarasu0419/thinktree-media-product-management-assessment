import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', icon: 'fa-solid fa-gauge-high', label: 'Dashboard', end: true },
  { to: '/admin/products', icon: 'fa-solid fa-box', label: 'Products', end: false },
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `${styles.navItem} ${isActive ? styles.navActive : ''}`;

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.logo}>
            <i className="fa-solid fa-cube" aria-hidden="true" />
          </span>
          <span>ProdManage</span>
        </Link>

        <nav className={styles.nav}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <i className={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <Link to="/products" className={styles.navItem} onClick={() => setOpen(false)}>
            <i className="fa-solid fa-store" aria-hidden="true" />
            <span>View storefront</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.user}>
            <span className={styles.avatar}>
              <i className="fa-solid fa-user" aria-hidden="true" />
            </span>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
          <button className={styles.logout} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <i className="fa-solid fa-bars" aria-hidden="true" />
          </button>
          <span className={styles.topTitle}>Admin</span>
        </header>
        <div className={styles.page}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
