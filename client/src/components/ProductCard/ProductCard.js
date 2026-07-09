import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';
import CustomCard from '../CustomCard/CustomCard';
import Badge from '../Badge/Badge';
import { formatPrice } from '../../utils/format';

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" fill="%239ca3af" font-family="Arial" font-size="22" text-anchor="middle" dy=".3em">No image</text></svg>';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const inStock = Number(product.stock_quantity) > 0;
  const hasDiscount =
    product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  const open = () => navigate(`/products/${product.slug}`);

  const onImgError = (e) => {
    e.currentTarget.src = FALLBACK_IMG;
  };

  return (
    <CustomCard hover padded={false} className={styles.card} onClick={open}>
      <div className={styles.imageWrap}>
        <img
          src={product.primary_image_url || FALLBACK_IMG}
          alt={product.name}
          className={styles.image}
          loading="lazy"
          onError={onImgError}
        />
        {product.is_featured ? (
          <span className={styles.featured}>
            <i className="fa-solid fa-star" aria-hidden="true" /> Featured
          </span>
        ) : null}
        {product.image_count > 1 ? (
          <span className={styles.imageCount}>
            <i className="fa-solid fa-images" aria-hidden="true" /> {product.image_count}
          </span>
        ) : null}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{product.category_name}</span>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price, product.currency)}</span>
          {hasDiscount && (
            <span className={styles.compare}>
              {formatPrice(product.compare_at_price, product.currency)}
            </span>
          )}
        </div>

        <div className={styles.footer}>
          {inStock ? (
            <Badge tone="success" icon="fa-solid fa-circle-check">
              In stock
            </Badge>
          ) : (
            <Badge tone="danger" icon="fa-solid fa-circle-xmark">
              Out of stock
            </Badge>
          )}
        </div>
      </div>
    </CustomCard>
  );
}

export default ProductCard;
