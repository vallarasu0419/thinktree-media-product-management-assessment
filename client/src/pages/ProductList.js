import React, { useCallback, useEffect, useState } from 'react';
import styles from './ProductList.module.css';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from '../components/SearchBar/SearchBar';
import CustomDropdown from '../components/CustomDropdown/CustomDropdown';
import Pagination from '../components/Pagination/Pagination';
import Loader from '../components/Loader/Loader';
import EmptyState from '../components/EmptyState/EmptyState';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
];

function ProductList() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryApi
      .list()
      .then((res) =>
        setCategories(res.data.map((c) => ({ value: c.slug, label: c.name })))
      )
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (inStock) params.inStock = 1;
      const res = await productApi.list(params);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch {
      setItems([]);
      setPagination({ page: 1, totalPages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category, inStock]);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const onCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };
  const onSort = (e) => setSort(e.target.value);
  const onStock = () => {
    setInStock((v) => !v);
    setPage(1);
  };

  return (
    <div className="app-container page-section">
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchCol}>
          <SearchBar value={search} onSearch={onSearch} />
        </div>
        <div className={styles.filterCol}>
          <CustomDropdown
            options={categories}
            value={category}
            onChange={onCategory}
            placeholder="All categories"
            icon="fa-solid fa-layer-group"
          />
        </div>
        <div className={styles.filterCol}>
          <CustomDropdown
            options={SORT_OPTIONS}
            value={sort}
            onChange={onSort}
            placeholder="Sort by"
            icon="fa-solid fa-arrow-down-wide-short"
          />
        </div>
        <button
          className={`${styles.stockToggle} ${inStock ? styles.stockActive : ''}`}
          onClick={onStock}
          type="button"
        >
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          In stock only
        </button>
      </div>

      {loading ? (
        <Loader label="Loading products…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-magnifying-glass"
          title="No products found"
          message="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className={styles.grid}>
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default ProductList;
