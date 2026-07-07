import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductDetails.module.css';
import { productApi } from '../api/productApi';
import Loader from '../components/Loader/Loader';
import EmptyState from '../components/EmptyState/EmptyState';
import Badge from '../components/Badge/Badge';
import CustomButton from '../components/CustomButton/CustomButton';
import { formatPrice } from '../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" fill="%239ca3af" font-family="Arial" font-size="22" text-anchor="middle" dy=".3em">No image</text></svg>';

function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await productApi.getBySlug(slug);
      const p = res.data;
      setProduct(p);
      const primary = (p.images && p.images.length > 0 && p.images[0].image_url) || FALLBACK_IMG;
      setActive(primary);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loader fullscreen label="Loading product…" />;

  if (notFound || !product) {
    return (
      <div className="app-container page-section">
        <EmptyState
          icon="fa-solid fa-box-open"
          title="Product not found"
          message="This product may have been removed."
        >
          <Link to="/products">
            <CustomButton icon="fa-solid fa-arrow-left">Back to products</CustomButton>
          </Link>
        </EmptyState>
      </div>
    );
  }

  const gallery =
    product.images && product.images.length > 0
      ? product.images.map((i) => i.image_url)
      : [FALLBACK_IMG];
  const imageCount = product.images ? product.images.length : 0;

  const inStock = Number(product.stock_quantity) > 0;
  const hasDiscount =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price);
  const discountPct = hasDiscount
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  return (
    <div className="app-container page-section">
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
        <Link to="/products">Products</Link>
        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={active || FALLBACK_IMG}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          </div>
          {gallery.length > 1 && (
            <div className={styles.thumbs}>
              {gallery.map((url, idx) => (
                <button
                  key={`${url}-${idx}`}
                  className={`${styles.thumb} ${active === url ? styles.thumbActive : ''}`}
                  onClick={() => setActive(url)}
                  type="button"
                >
                  <img
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
          <div className={styles.imageCountRow}>
            <i className="fa-solid fa-images" aria-hidden="true" /> {imageCount}{' '}
            {imageCount === 1 ? 'photo' : 'photos'}
          </div>
        </div>

        <div className={styles.info}>
          <Link to={`/products?category=${product.category_slug}`} className={styles.category}>
            {product.category_name}
          </Link>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.sku}>SKU: {product.sku}</div>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price, product.currency)}</span>
            {hasDiscount && (
              <>
                <span className={styles.compare}>
                  {formatPrice(product.compare_at_price, product.currency)}
                </span>
                <Badge tone="danger">-{discountPct}%</Badge>
              </>
            )}
          </div>

          <div className={styles.stockRow}>
            {inStock ? (
              <Badge tone="success" icon="fa-solid fa-circle-check">
                In stock ({product.stock_quantity} available)
              </Badge>
            ) : (
              <Badge tone="danger" icon="fa-solid fa-circle-xmark">
                Out of stock
              </Badge>
            )}
            {product.is_featured ? (
              <Badge tone="primary" icon="fa-solid fa-star">
                Featured
              </Badge>
            ) : null}
          </div>

          {product.short_description && (
            <p className={styles.short}>{product.short_description}</p>
          )}

          {product.description && (
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <Link to="/products" className={styles.backLink}>
            <CustomButton variant="outline" icon="fa-solid fa-arrow-left">
              Back to products
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
