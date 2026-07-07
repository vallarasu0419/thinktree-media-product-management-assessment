import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import { productApi } from '../api/productApi';
import ProductCard from '../components/ProductCard/ProductCard';
import CustomButton from '../components/CustomButton/CustomButton';
import Loader from '../components/Loader/Loader';

function Landing() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.list({ featured: 1, limit: 4 });
      setFeatured(res.data.items);
    } catch {
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={`app-container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <i className="fa-solid fa-bolt" aria-hidden="true" /> Manage products with ease
            </span>
            <h1 className={styles.title}>
              A clean, fast storefront &amp; admin for your <span>products</span>
            </h1>
            <p className={styles.subtitle}>
              Browse the catalogue, search by name, filter by category, and manage
              everything from a secure admin dashboard.
            </p>
            <div className={styles.actions}>
              <Link to="/products">
                <CustomButton size="lg" icon="fa-solid fa-store">
                  Browse products
                </CustomButton>
              </Link>
              <Link to="/login">
                <CustomButton size="lg" variant="ghost" icon="fa-solid fa-lock">
                  Admin login
                </CustomButton>
              </Link>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.blob} />
            <i className={`fa-solid fa-boxes-stacked ${styles.heroIcon}`} />
          </div>
        </div>
      </section>

      <section className="app-container page-section">
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Featured products</h2>
          <Link to="/products" className={styles.seeAll}>
            See all <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured products…" />
        ) : featured.length === 0 ? (
          <p className={styles.empty}>No featured products yet.</p>
        ) : (
          <div className={styles.grid}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Landing;
