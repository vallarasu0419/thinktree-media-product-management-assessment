const express = require('express');
const ctrl = require('../controllers/productController');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { requireAuth, requireRole } = require('../middleware/auth');
const { productRules } = require('../validators/productValidators');

const router = express.Router();

const admin = requireRole('super_admin', 'admin', 'staff');

// Public
router.get('/', ctrl.listProducts);

// Admin (place specific paths before the /:slug catch-all)
router.get('/admin/stats', requireAuth, admin, ctrl.stats);
router.get('/id/:id', requireAuth, admin, ctrl.getProductById);
router.post(
  '/upload-images',
  requireAuth,
  admin,
  upload.array('images', upload.MAX_IMAGES_PER_PRODUCT),
  ctrl.uploadProductImages
);
router.post('/', requireAuth, admin, productRules, validate, ctrl.createProduct);
router.put('/:id', requireAuth, admin, productRules, validate, ctrl.updateProduct);
router.delete('/:id', requireAuth, admin, ctrl.deleteProduct);

// Public single (slug) — keep last so it doesn't shadow the routes above
router.get('/:slug', ctrl.getProduct);

module.exports = router;
