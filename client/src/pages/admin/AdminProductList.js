import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminProductList.module.css';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import SearchBar from '../../components/SearchBar/SearchBar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import Badge from '../../components/Badge/Badge';
import CustomButton from '../../components/CustomButton/CustomButton';
import { formatPrice } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" fill="%239ca3af" font-family="Arial" font-size="10" text-anchor="middle" dy=".3em">N/A</text></svg>';

function statusTone(status) {
  return status === 'active' ? 'success' : 'neutral';
}

function AdminProductList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryApi
      .list()
      .then((res) => setCategories(res.data.map((c) => ({ value: c.slug, label: c.name }))))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort: 'newest' };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      const res = await productApi.list(params);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>{pagination.total} total</p>
        </div>
        {/* Top-right add icon → create screen */}
        <Link to="/admin/products/new" className={styles.addBtn} aria-label="Add product">
          <i className="fa-solid fa-plus" aria-hidden="true" />
          <span>Add product</span>
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchCol}>
          <SearchBar
            value={search}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by name…"
          />
        </div>
        <CustomDropdown
          options={categories}
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          placeholder="All categories"
          icon="fa-solid fa-layer-group"
        />
        <CustomDropdown
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          placeholder="All status"
          icon="fa-solid fa-signal"
        />
      </div>

      {loading ? (
        <Loader label="Loading products…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon="fa-solid fa-box-open"
          title="No products"
          message="Create your first product to get started."
        >
          <Link to="/admin/products/new">
            <CustomButton icon="fa-solid fa-plus">Add product</CustomButton>
          </Link>
        </EmptyState>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className={styles.actionsCol}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumbWrap}>
                          <img
                            src={p.primary_image_url || FALLBACK_IMG}
                            alt={p.name}
                            className={styles.thumb}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMG;
                            }}
                          />
                          {p.image_count > 1 && (
                            <span className={styles.thumbCount}>{p.image_count}</span>
                          )}
                        </div>
                        <div>
                          <div className={styles.pname}>{p.name}</div>
                          <div className={styles.psku}>{p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category_name}</td>
                    <td className={styles.price}>{formatPrice(p.price, p.currency)}</td>
                    <td>
                      {Number(p.stock_quantity) > 0 ? (
                        <span>{p.stock_quantity}</span>
                      ) : (
                        <Badge tone="danger">0</Badge>
                      )}
                    </td>
                    <td>
                      <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {/* Eye icon → view screen */}
                        <button
                          className={styles.iconBtn}
                          title="View"
                          aria-label="View product"
                          onClick={() => navigate(`/admin/products/${p.id}`)}
                        >
                          <i className="fa-solid fa-eye" aria-hidden="true" />
                        </button>
                        {/* Edit button */}
                        <button
                          className={`${styles.iconBtn} ${styles.editBtn}`}
                          title="Edit"
                          aria-label="Edit product"
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        >
                          <i className="fa-solid fa-pen" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AdminProductList;
