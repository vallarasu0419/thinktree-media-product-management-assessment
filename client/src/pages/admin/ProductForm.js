import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './ProductForm.module.css';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomCard from '../../components/CustomCard/CustomCard';
import Loader from '../../components/Loader/Loader';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const EMPTY = {
  sku: '',
  name: '',
  slug: '',
  category_id: '',
  short_description: '',
  description: '',
  price: '',
  compare_at_price: '',
  currency: 'INR',
  stock_quantity: '0',
  low_stock_threshold: '5',
  status: 'active',
  is_featured: false,
  weight_grams: '',
};

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // [{ url, alt_text }]
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    categoryApi
      .list()
      .then((res) => setCategories(res.data.map((c) => ({ value: String(c.id), label: c.name }))))
      .catch(() => setCategories([]));
  }, []);

  const loadProduct = useCallback(async () => {
    if (!isEdit) return;
    setLoading(true);
    try {
      const res = await productApi.getById(id);
      const p = res.data;
      setForm({
        sku: p.sku || '',
        name: p.name || '',
        slug: p.slug || '',
        category_id: String(p.category_id || ''),
        short_description: p.short_description || '',
        description: p.description || '',
        price: p.price != null ? String(p.price) : '',
        compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : '',
        currency: p.currency || 'INR',
        stock_quantity: p.stock_quantity != null ? String(p.stock_quantity) : '0',
        low_stock_threshold: p.low_stock_threshold != null ? String(p.low_stock_threshold) : '5',
        status: p.status || 'active',
        is_featured: Boolean(p.is_featured),
        weight_grams: p.weight_grams != null ? String(p.weight_grams) : '',
      });
      setImages(
        (p.images || []).map((img) => ({ url: img.image_url, alt_text: img.alt_text || '' }))
      );
    } catch {
      setApiError('Could not load this product.');
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const onFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    setImageError('');

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setImageError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const toUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setImageError(`Only ${remainingSlots} more image(s) can be added (max ${MAX_IMAGES}).`);
    }

    const oversized = toUpload.find((f) => f.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setImageError(`"${oversized.name}" is larger than 10MB.`);
      return;
    }

    setImageUploading(true);
    try {
      const res = await productApi.uploadImages(toUpload);
      const uploaded = res.data.images.map((img) => ({ url: img.url, alt_text: '' }));
      setImages((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
    } catch (err) {
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        'Could not upload the images.';
      setImageError(msg);
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const next = {};
    if (!form.sku.trim()) next.sku = 'SKU is required';
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.category_id) next.category_id = 'Category is required';
    if (!form.short_description.trim()) next.short_description = 'Short description is required';
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      next.price = 'Enter a valid price';
    if (
      form.compare_at_price === '' ||
      Number.isNaN(Number(form.compare_at_price)) ||
      Number(form.compare_at_price) < 0
    )
      next.compare_at_price = 'Compare-at price is required';
    if (
      form.stock_quantity !== '' &&
      (Number.isNaN(Number(form.stock_quantity)) || Number(form.stock_quantity) < 0)
    )
      next.stock_quantity = 'Enter a valid quantity';
    if (
      form.low_stock_threshold === '' ||
      Number.isNaN(Number(form.low_stock_threshold)) ||
      Number(form.low_stock_threshold) < 0
    )
      next.low_stock_threshold = 'Low-stock threshold is required';
    if (
      form.weight_grams === '' ||
      Number.isNaN(Number(form.weight_grams)) ||
      Number(form.weight_grams) < 0
    )
      next.weight_grams = 'Weight (grams) is required';
    if (images.length === 0) next.images = 'At least 1 image is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError('');

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: Number(form.category_id),
      short_description: form.short_description.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: Number(form.compare_at_price),
      currency: form.currency || 'INR',
      stock_quantity: form.stock_quantity === '' ? 0 : Number(form.stock_quantity),
      low_stock_threshold: Number(form.low_stock_threshold),
      status: form.status,
      is_featured: form.is_featured,
      weight_grams: Number(form.weight_grams),
      images: images.map((img, idx) => ({
        url: img.url,
        alt_text: img.alt_text || null,
        is_primary: idx === 0,
      })),
    };

    try {
      if (isEdit) {
        await productApi.update(id, payload);
      } else {
        await productApi.create(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      const msg =
        (err.response && err.response.data && err.response.data.message) ||
        'Could not save the product.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading product…" />;

  return (
    <div>
      <div className={styles.head}>
        <div>
          <Link to="/admin/products" className={styles.back}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back to products
          </Link>
          <h1 className={styles.title}>{isEdit ? 'Edit product' : 'Create product'}</h1>
        </div>
      </div>

      {apiError && (
        <div className={styles.alert}>
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {apiError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className={styles.layout}>
          <div className={styles.mainCol}>
            <CustomCard className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic details</h2>
              <div className={styles.grid2}>
                <CustomInput
                  label="SKU"
                  name="sku"
                  value={form.sku}
                  onChange={onChange}
                  error={errors.sku}
                  placeholder="ELEC-1001"
                  required
                />
                <CustomInput
                  label="Slug (optional)"
                  name="slug"
                  value={form.slug}
                  onChange={onChange}
                  placeholder="auto-generated from name"
                />
              </div>
              <CustomInput
                label="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                error={errors.name}
                placeholder="Wireless Headphones"
                required
              />
              <CustomInput
                label="Short description"
                name="short_description"
                value={form.short_description}
                onChange={onChange}
                error={errors.short_description}
                placeholder="One-line summary shown on cards"
                required
              />
              <CustomInput
                label="Description"
                name="description"
                value={form.description}
                onChange={onChange}
                textarea
                rows={5}
                placeholder="Full product description"
              />
            </CustomCard>

            <CustomCard className={styles.section}>
              <h2 className={styles.sectionTitle}>Pricing &amp; inventory</h2>
              <div className={styles.grid2}>
                <CustomInput
                  label="Price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={onChange}
                  error={errors.price}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                <CustomInput
                  label="Compare-at price"
                  name="compare_at_price"
                  type="number"
                  value={form.compare_at_price}
                  onChange={onChange}
                  error={errors.compare_at_price}
                  placeholder="Original / MRP"
                  min="0"
                  step="0.01"
                  required
                />
                <CustomInput
                  label="Stock quantity"
                  name="stock_quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={onChange}
                  error={errors.stock_quantity}
                  min="0"
                />
                <CustomInput
                  label="Low-stock threshold"
                  name="low_stock_threshold"
                  type="number"
                  value={form.low_stock_threshold}
                  onChange={onChange}
                  error={errors.low_stock_threshold}
                  min="0"
                  required
                />
                <CustomInput
                  label="Currency"
                  name="currency"
                  value={form.currency}
                  onChange={onChange}
                  placeholder="INR"
                  maxLength={3}
                />
                <CustomInput
                  label="Weight (grams)"
                  name="weight_grams"
                  type="number"
                  value={form.weight_grams}
                  onChange={onChange}
                  error={errors.weight_grams}
                  min="0"
                  required
                />
              </div>
            </CustomCard>
          </div>

          <div className={styles.sideCol}>
            <CustomCard className={styles.section}>
              <h2 className={styles.sectionTitle}>Organisation</h2>
              <CustomDropdown
                label="Category"
                name="category_id"
                value={form.category_id}
                onChange={onChange}
                options={categories}
                error={errors.category_id}
                placeholder="Select category"
                icon="fa-solid fa-layer-group"
                required
              />
              <CustomDropdown
                label="Status"
                name="status"
                value={form.status}
                onChange={onChange}
                options={STATUS_OPTIONS}
                placeholder="Select status"
                icon="fa-solid fa-signal"
              />
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={onChange}
                />
                <span>Feature this product</span>
              </label>
            </CustomCard>

            <CustomCard className={styles.section}>
              <div className={styles.imagesHead}>
                <h2 className={styles.sectionTitle}>Images</h2>
                <span className={styles.imageCount}>
                  {images.length} / {MAX_IMAGES}
                </span>
              </div>
              <p className={styles.imageHint}>
                1 image is required, up to {MAX_IMAGES} allowed. Max 10MB each. The first image
                is used as the primary image.
              </p>

              {images.length < MAX_IMAGES && (
                <div className={styles.fileRow}>
                  <label
                    htmlFor="product-images"
                    className={`${styles.fileLabel} ${imageUploading ? styles.fileLabelDisabled : ''}`}
                  >
                    <i className="fa-solid fa-upload" aria-hidden="true" />
                    {imageUploading ? 'Uploading…' : 'Choose file(s)'}
                  </label>
                  <input
                    id="product-images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={onFileChange}
                    disabled={imageUploading}
                    className={styles.fileInput}
                    multiple
                  />
                </div>
              )}
              {(imageError || errors.images) && (
                <span className={styles.error}>{imageError || errors.images}</span>
              )}

              {images.length > 0 && (
                <div className={styles.imagesGrid}>
                  {images.map((img, idx) => (
                    <div key={img.url} className={styles.imageTile}>
                      <img
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {idx === 0 && <span className={styles.primaryTag}>Primary</span>}
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                        title="Remove image"
                      >
                        <i className="fa-solid fa-xmark" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CustomCard>

            <div className={styles.actions}>
              <CustomButton type="submit" block size="lg" loading={saving} icon="fa-solid fa-floppy-disk">
                {isEdit ? 'Save changes' : 'Create product'}
              </CustomButton>
              <Link to="/admin/products" className={styles.cancelLink}>
                <CustomButton type="button" variant="ghost" block>
                  Cancel
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
