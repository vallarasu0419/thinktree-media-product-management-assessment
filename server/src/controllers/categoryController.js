const { pool } = require('../config/db');
const { asyncHandler, ok } = require('../utils/helpers');

// GET /api/categories  — active categories for filters/forms
const listCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, slug, description, parent_id, sort_order
     FROM categories
     WHERE is_active = 1
     ORDER BY sort_order ASC, name ASC`
  );
  return ok(res, rows, 'OK');
});

module.exports = { listCategories };
