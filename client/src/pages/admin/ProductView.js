import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './ProductView.module.css';
import { productApi } from '../../api/productApi';
import CustomCard from '../../components/CustomCard/CustomCard';
import CustomButton from '../../components/CustomButton/CustomButton';
import Badge from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatPrice, formatDate } from '../../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" fill="%239ca3af" font-family="Arial" font-size="22" text-anchor="middle" dy=".3em">No image</text></svg>';

function statusTone(status) {
  return status === 'active' ? 'success' : 'neutral';
}

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await productApi.getById(id);
      setProduct(res.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productApi.remove(id);
      setConfirmOpen(false);
      navigate('/admin/products');
    } catch {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loader label="Loading product…" />;

  if (notFound || !product) {
    return (
      <EmptyState
        icon="fa-solid fa-box-open"
        title="Product not found"
        message="It may have been deleted."
      >
        <Link to="/admin/products">
          <CustomButton icon="fa-solid fa-arrow-left">Back to products</CustomButton>
        </Link>
      </EmptyState>
    );
  }

  const gallery =
    product.images && product.images.length > 0
      ? product.images.map((i) => i.image_url)
      : [FALLBACK_IMG];
  const imageCount = product.images ? product.images.length : 0;
  const inStock = Number(product.stock_quantity) > 0;

  return (
    <div>
      <div className={styles.head}>
        <div>
          <Link to="/admin/products" className={styles.back}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back to products
          </Link>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.sku}>SKU: {product.sku}</div>
        </div>
        <div className={styles.headActions}>
          <Link to={`/admin/products/${product.id}/edit`}>
            <CustomButton variant="outline" icon="fa-solid fa-pen">
              Edit
            </CustomButton>
          </Link>
          {/* Delete → soft delete only */}
          <CustomButton
            variant="danger"
            icon="fa-solid fa-trash"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </CustomButton>
        </div>
      </div>

      <div className={styles.layout}>
        <CustomCard padded={false} className={styles.imageCard}>
          <img
            src={gallery[0] || FALLBACK_IMG}
            alt={product.name}
            className={styles.mainImage}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
          {gallery.length > 1 && (
            <div className={styles.thumbs}>
              {gallery.map((url, idx) => (
                <img
                  key={`${url}-${idx}`}
                  src={url}
                  alt={`${product.name} ${idx + 1}`}
                  className={styles.thumb}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              ))}
            </div>
          )}
          <div className={styles.imageCountRow}>
            <i className="fa-solid fa-images" aria-hidden="true" /> {imageCount}{' '}
            {imageCount === 1 ? 'image' : 'images'}
          </div>
        </CustomCard>

        <div className={styles.details}>
          <CustomCard className={styles.section}>
            <div className={styles.badges}>
              <Badge tone={statusTone(product.status)}>{product.status}</Badge>
              {inStock ? (
                <Badge tone="success" icon="fa-solid fa-circle-check">
                  In stock
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

            <div className={styles.rows}>
              <Row label="Category" value={product.category_name} />
              <Row label="Price" value={formatPrice(product.price, product.currency)} />
              <Row
                label="Compare-at"
                value={
                  product.compare_at_price
                    ? formatPrice(product.compare_at_price, product.currency)
                    : '—'
                }
              />
              <Row label="Stock quantity" value={product.stock_quantity} />
              <Row label="Low-stock threshold" value={product.low_stock_threshold} />
              <Row label="Weight" value={product.weight_grams ? `${product.weight_grams} g` : '—'} />
              <Row label="Created" value={formatDate(product.created_at)} />
              <Row label="Updated" value={formatDate(product.updated_at)} />
            </div>
          </CustomCard>

          {(product.short_description || product.description) && (
            <CustomCard className={styles.section}>
              <h2 className={styles.sectionTitle}>Description</h2>
              {product.short_description && (
                <p className={styles.short}>{product.short_description}</p>
              )}
              {product.description && <p className={styles.desc}>{product.description}</p>}
            </CustomCard>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Delete product?"
        onClose={() => (!deleting ? setConfirmOpen(false) : null)}
        footer={
          <>
            <CustomButton variant="ghost" onClick={() => setConfirmOpen(false)} disabled={deleting}>
              Cancel
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
              icon="fa-solid fa-trash"
            >
              Delete
            </CustomButton>
          </>
        }
      >
        <p className={styles.confirmText}>
          This will remove <strong>{product.name}</strong> from all listings. This is a soft
          delete — the record is kept in the database and can be restored later.
        </p>
      </Modal>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}

export default ProductView;
