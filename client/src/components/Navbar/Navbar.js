import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/AuthContext';

const ADMIN_ROLES = ['super_admin', 'admin', 'staff'];

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`;

  return (
    <header className={styles.header}>
      <div className={`app-container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.logo}>
            <i className="fa-solid fa-cube" aria-hidden="true" />
          </span>
          <span className={styles.brandText}>ProdManage</span>
        </Link>

        <button
          className={styles.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <NavLink to="/" className={linkClass} onClick={close} end>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass} onClick={close}>
                  Dashboard
                </NavLink>
              )}
              <div className={styles.userBox}>
                <span className={styles.userName}>
                  <i className="fa-solid fa-user-shield" aria-hidden="true" />
                  {user?.name}
                </span>
                <button className={styles.logout} onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className={styles.authBox}>
              <NavLink to="/login" className={styles.loginLink} onClick={close}>
                Login
              </NavLink>
              <NavLink to="/register" className={styles.registerLink} onClick={close}>
                Register
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
