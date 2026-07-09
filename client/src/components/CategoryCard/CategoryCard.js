import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryCard.module.css';
import CustomCard from '../CustomCard/CustomCard';
import { getCategoryIcon } from '../../utils/categoryIcons';

function CategoryCard({ category }) {
  const navigate = useNavigate();

  const open = () => navigate(`/products?category=${category.slug}`);

  return (
    <CustomCard hover className={styles.card} onClick={open}>
      <span className={styles.iconWrap}>
        <i className={getCategoryIcon(category.slug)} aria-hidden="true" />
      </span>
      <span className={styles.name}>{category.name}</span>
    </CustomCard>
  );
}

export default CategoryCard;
