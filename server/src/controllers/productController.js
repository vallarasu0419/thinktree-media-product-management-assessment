const { pool } = require('../config/db');
const { asyncHandler, ok, ApiError } = require('../utils/helpers');

const SORT_MAP = {
  newest: 'p.created_at DESC',
  oldest: 'p.created_at ASC',
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
  name_asc: 'p.name ASC',
  name_desc: 'p.name DESC',
};

const MAX_IMAGES_PER_PRODUCT = 4;

function toSlug(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Wipes and re-inserts a product's gallery, choosing a single primary image.
async function replaceProductImages(conn, productId, images) {
  await conn.query('DELETE FROM product_images WHERE product_id = ?', [productId]);

  const explicitPrimaryIdx = images.findIndex((img) => img.is_primary);
  const primaryIdx = explicitPrimaryIdx >= 0 ? explicitPrimaryIdx : 0;

  for (let i = 0; i < images.length; i += 1) {
    const img = images[i];
    // eslint-disable-next-line no-await-in-loop
    await conn.query(
      `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [productId, img.url, img.alt_text || null, i === primaryIdx ? 1 : 0, i]
    );
  }
}

// GET /api/products  — public paginated listing with search + filters
const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
  const offset = (page - 1) * limit;

  const { search, category, inStock, status, featured } = req.query;
  const sort = SORT_MAP[req.query.sort] || SORT_MAP.newest;

  const where = ['p.deleted_at IS NULL'];
  const params = [];

  if (status) {
    where.push('p.status = ?');
    params.push(status);
  } else {
    // Public listing defaults to active products only.
    where.push("p.status = 'active'");
  }

  if (category) {
    if (/^\d+$/.test(String(category))) {
      where.push('p.category_id = ?');
      params.push(Number(category));
    } else {
      where.push('c.slug = ?');
      params.push(category);
    }
  }

  if (inStock === '1' || inStock === 'true') {
    where.push('p.is_in_stock = 1');
  }

  if (featured === '1' || featured === 'true') {
    where.push('p.is_featured = 1');
  }

  if (search && search.trim()) {
    // LIKE keeps behaviour predictable across short queries; FULLTEXT index still exists.
    where.push('(p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ?)');
    const like = `%${search.trim()}%`;
    params.push(like, like, like);
  }

  const whereSql = where.join(' AND ');

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE ${whereSql}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT
       p.id, p.sku, p.name, p.slug, p.price, p.compare_at_price, p.currency,
       p.stock_quantity, p.is_in_stock, p.status, p.is_featured,
       p.short_description, p.category_id,
       c.name AS category_name, c.slug AS category_slug, p.created_at,
       (SELECT pi.image_url FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.is_primary DESC, pi.sort_order ASC LIMIT 1) AS primary_image_url,
       (SELECT COUNT(*) FROM product_images pi2 WHERE pi2.product_id = p.id) AS image_count
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE ${whereSql}
     ORDER BY ${sort}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return ok(
    res,
    {
      items: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    },
    'OK'
  );
});

// GET /api/products/:slug  — single product + gallery
const getProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const [rows] = await pool.query(
    `SELECT
       p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.deleted_at IS NULL`,
    [slug]
  );

  if (rows.length === 0) {
    throw new ApiError(404, 'Product not found');
  }

  const product = rows[0];
  const [images] = await pool.query(
    `SELECT id, image_url, alt_text, is_primary, sort_order
     FROM product_images
     WHERE product_id = ?
     ORDER BY is_primary DESC, sort_order ASC`,
    [product.id]
  );

  return ok(res, { ...product, images, image_count: images.length }, 'OK');
});

// GET /api/products/id/:id  — single product by id (admin edit)
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? AND p.deleted_at IS NULL`,
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'Product not found');
  }
  const product = rows[0];
  const [images] = await pool.query(
    `SELECT id, image_url, alt_text, is_primary, sort_order
     FROM product_images WHERE product_id = ?
     ORDER BY is_primary DESC, sort_order ASC`,
    [product.id]
  );
  return ok(res, { ...product, images, image_count: images.length }, 'OK');
});

// POST /api/products  — admin create
const createProduct = asyncHandler(async (req, res) => {
  const b = req.body;
  const slug = b.slug && b.slug.trim() ? toSlug(b.slug) : toSlug(b.name);
  const images = Array.isArray(b.images) ? b.images.slice(0, MAX_IMAGES_PER_PRODUCT) : [];

  if (images.length === 0) {
    throw new ApiError(422, 'At least 1 product image is required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO products
         (sku, name, slug, category_id, short_description, description,
          price, compare_at_price, currency, stock_quantity, low_stock_threshold,
          status, is_featured, weight_grams, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.sku,
        b.name,
        slug,
        b.category_id,
        b.short_description,
        b.description || null,
        b.price,
        b.compare_at_price,
        b.currency || 'INR',
        b.stock_quantity != null ? b.stock_quantity : 0,
        b.low_stock_threshold,
        b.status || 'active',
        b.is_featured ? 1 : 0,
        b.weight_grams,
        req.user.id,
        req.user.id,
      ]
    );

    await replaceProductImages(conn, result.insertId, images);
    await conn.commit();

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    const [savedImages] = await pool.query(
      `SELECT id, image_url, alt_text, is_primary, sort_order
       FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC`,
      [result.insertId]
    );
    return ok(
      res,
      { ...rows[0], images: savedImages, image_count: savedImages.length },
      'Product created',
      201
    );
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// PUT /api/products/:id  — admin update
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const b = req.body;

  const [existing] = await pool.query(
    'SELECT id FROM products WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  if (existing.length === 0) {
    throw new ApiError(404, 'Product not found');
  }

  const slug = b.slug && b.slug.trim() ? toSlug(b.slug) : toSlug(b.name);
  const images = Array.isArray(b.images) ? b.images.slice(0, MAX_IMAGES_PER_PRODUCT) : [];

  if (images.length === 0) {
    throw new ApiError(422, 'At least 1 product image is required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE products SET
         sku = ?, name = ?, slug = ?, category_id = ?, short_description = ?,
         description = ?, price = ?, compare_at_price = ?, currency = ?,
         stock_quantity = ?, low_stock_threshold = ?, status = ?,
         is_featured = ?, weight_grams = ?, updated_by = ?
       WHERE id = ?`,
      [
        b.sku,
        b.name,
        slug,
        b.category_id,
        b.short_description,
        b.description || null,
        b.price,
        b.compare_at_price,
        b.currency || 'INR',
        b.stock_quantity != null ? b.stock_quantity : 0,
        b.low_stock_threshold,
        b.status || 'active',
        b.is_featured ? 1 : 0,
        b.weight_grams,
        req.user.id,
        id,
      ]
    );

    await replaceProductImages(conn, id, images);
    await conn.commit();

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    const [savedImages] = await pool.query(
      `SELECT id, image_url, alt_text, is_primary, sort_order
       FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC`,
      [id]
    );
    return ok(
      res,
      { ...rows[0], images: savedImages, image_count: savedImages.length },
      'Product updated'
    );
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// DELETE /api/products/:id  — SOFT delete only
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [existing] = await pool.query(
    'SELECT id FROM products WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  if (existing.length === 0) {
    throw new ApiError(404, 'Product not found');
  }

  await pool.query('UPDATE products SET deleted_at = NOW() WHERE id = ?', [id]);
  return ok(res, { id: Number(id) }, 'Product deleted');
});

// POST /api/products/upload-images  — admin uploads up to 4 product image files (multer)
const uploadProductImages = asyncHandler(async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) {
    throw new ApiError(400, 'At least one image file is required');
  }
  if (files.length > MAX_IMAGES_PER_PRODUCT) {
    throw new ApiError(400, `A maximum of ${MAX_IMAGES_PER_PRODUCT} images can be uploaded at once`);
  }

  const images = files.map((file) => ({
    url: `${req.protocol}://${req.get('host')}/product-images/${file.filename}`,
  }));

  return ok(res, { images }, 'Images uploaded', 201);
});

// GET /api/products/admin/stats  — dashboard widgets
const stats = asyncHandler(async (req, res) => {
  const [[totals]] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'active')   AS active,
       SUM(status = 'inactive') AS inactive,
       SUM(is_in_stock = 0)     AS out_of_stock,
       SUM(stock_quantity <= low_stock_threshold AND stock_quantity > 0) AS low_stock
     FROM products
     WHERE deleted_at IS NULL`
  );
  const [[cat]] = await pool.query(
    'SELECT COUNT(*) AS categories FROM categories WHERE is_active = 1'
  );

  return ok(
    res,
    {
      total: Number(totals.total) || 0,
      active: Number(totals.active) || 0,
      inactive: Number(totals.inactive) || 0,
      outOfStock: Number(totals.out_of_stock) || 0,
      lowStock: Number(totals.low_stock) || 0,
      categories: Number(cat.categories) || 0,
    },
    'OK'
  );
});

module.exports = {
  listProducts,
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  stats,
};
