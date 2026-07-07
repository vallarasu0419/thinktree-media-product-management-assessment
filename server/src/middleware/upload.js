const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { ApiError } = require('../utils/helpers');

// Product images are written straight to disk under /public so they can be
// served as static files and referenced by URL from the `products` table.
const uploadDir = path.join(__dirname, '../../public/product-images');
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new ApiError(400, 'Only JPEG, PNG, WEBP or GIF images are allowed'));
}

const MAX_IMAGES_PER_PRODUCT = 4;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
module.exports.MAX_IMAGES_PER_PRODUCT = MAX_IMAGES_PER_PRODUCT;
