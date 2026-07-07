import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { productApi } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import CustomCard from '../../components/CustomCard/CustomCard';
import CustomButton from '../../components/CustomButton/CustomButton';
import Loader from '../../components/Loader/Loader';

const CARDS = [
  { key: 'total', label: 'Total products', icon: 'fa-solid fa-box', tone: 'primary' },
  { key: 'active', label: 'Active', icon: 'fa-solid fa-circle-check', tone: 'success' },
  { key: 'lowStock', label: 'Low stock', icon: 'fa-solid fa-triangle-exclamation', tone: 'warning' },
  { key: 'outOfStock', label: 'Out of stock', icon: 'fa-solid fa-circle-xmark', tone: 'danger' },
  { key: 'inactive', label: 'Inactive', icon: 'fa-solid fa-ban', tone: 'info' },
  { key: 'categories', label: 'Categories', icon: 'fa-solid fa-layer-group', tone: 'primary' },
];

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.stats();
      setStats(res.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.name} 👋</h1>
          <p className={styles.subtitle}>Here&apos;s an overview of your catalogue.</p>
        </div>
        <Link to="/admin/products/new">
          <CustomButton icon="fa-solid fa-plus">Add product</CustomButton>
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading dashboard…" />
      ) : !stats ? (
        <p className={styles.error}>Could not load statistics.</p>
      ) : (
        <div className={styles.grid}>
          {CARDS.map((card) => (
            <CustomCard key={card.key} className={styles.statCard}>
              <div className={`${styles.iconBox} ${styles[card.tone]}`}>
                <i className={card.icon} aria-hidden="true" />
              </div>
              <div>
                <div className={styles.statValue}>{stats[card.key] ?? 0}</div>
                <div className={styles.statLabel}>{card.label}</div>
              </div>
            </CustomCard>
          ))}
        </div>
      )}

      <div className={styles.quick}>
        <h2 className={styles.quickTitle}>Quick actions</h2>
        <div className={styles.quickRow}>
          <Link to="/admin/products">
            <CustomButton variant="outline" icon="fa-solid fa-list">
              Manage products
            </CustomButton>
          </Link>
          <Link to="/admin/products/new">
            <CustomButton variant="outline" icon="fa-solid fa-plus">
              Create product
            </CustomButton>
          </Link>
          <Link to="/products">
            <CustomButton variant="ghost" icon="fa-solid fa-store">
              View storefront
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
