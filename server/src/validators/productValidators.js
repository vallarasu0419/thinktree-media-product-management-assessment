const { body } = require('express-validator');

const productRules = [
  body('sku').trim().notEmpty().withMessage('SKU is required').isLength({ max: 64 }),
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('category_id').notEmpty().withMessage('Category is required').isInt({ min: 1 }),
  body('short_description')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 500 })
    .withMessage('Short description must be 500 characters or fewer'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('compare_at_price')
    .notEmpty()
    .withMessage('Compare-at price is required')
    .isFloat({ min: 0 })
    .withMessage('Compare-at price must be a positive number'),
  body('stock_quantity')
    .optional({ nullable: true })
    .isInt({ min: 0 })
    .withMessage('Stock must be zero or more'),
  body('low_stock_threshold')
    .notEmpty()
    .withMessage('Low-stock threshold is required')
    .isInt({ min: 0 })
    .withMessage('Low-stock threshold must be zero or more'),
  body('weight_grams')
    .notEmpty()
    .withMessage('Weight (grams) is required')
    .isInt({ min: 0 })
    .withMessage('Weight (grams) must be zero or more'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
  body('images')
    .isArray({ min: 1, max: 4 })
    .withMessage('Between 1 and 4 images are required'),
  body('images.*.url')
    .trim()
    .notEmpty()
    .withMessage('Each image must have a URL'),
];

module.exports = { productRules };
