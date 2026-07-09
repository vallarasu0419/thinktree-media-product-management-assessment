import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard/ProductCard';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import CustomButton from '../components/CustomButton/CustomButton';
import Loader from '../components/Loader/Loader';

const MAX_CATEGORIES = 8;

function Landing() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.list({ featured: 1, limit: 8 });
      setFeatured(res.data.items);
    } catch {
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await categoryApi.list();
      setCategories(res.data.slice(0, MAX_CATEGORIES));
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    loadCategories();
  }, [load, loadCategories]);

  return (
    <div>
      <section className={styles.hero}>
        <div className={`app-container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <i className="fa-solid fa-tags" aria-hidden="true" /> Flat 40% off on featured picks this week
            </span>
            <h1 className={styles.title}>
              Everything you need, at prices you&apos;ll <span>love</span>
            </h1>
            <p className={styles.subtitle}>
              Shop electronics, fashion, books and more from a catalogue built for
              easy browsing. Free shipping over ₹999, secure checkout, and easy
              7-day returns on every order.
            </p>
            <div className={styles.actions}>
              <Link to="/products">
                <CustomButton size="lg" icon="fa-solid fa-store">
                  Browse products
                </CustomButton>
              </Link>
            </div>
            <div className={styles.perks}>
              <span className={styles.perk}>
                <i className="fa-solid fa-truck-fast" aria-hidden="true" /> Free shipping over ₹999
              </span>
              <span className={styles.perk}>
                <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Secure checkout
              </span>
              <span className={styles.perk}>
                <i className="fa-solid fa-rotate-left" aria-hidden="true" /> 7-day easy returns
              </span>
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
          <h2 className={styles.sectionTitle}>Shop by category</h2>
        </div>

        {categoriesLoading ? (
          <Loader label="Loading categories…" />
        ) : categories.length === 0 ? (
          <p className={styles.empty}>No categories yet.</p>
        ) : (
          <div className={styles.grid}>
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}
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
