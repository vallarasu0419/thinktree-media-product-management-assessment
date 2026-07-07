const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const { assertConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin || /^https?:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves uploaded product images (written here by multer, see middleware/upload.js)
app.use('/product-images', express.static(path.join(__dirname, '../public/product-images')));
if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await assertConnection();
    // eslint-disable-next-line no-console
    console.log('✓ Connected to MySQL');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('✗ Could not connect to MySQL:', err.message);
    // eslint-disable-next-line no-console
    console.error('  Check your .env DB settings and that the database is imported.');
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`✓ API listening on http://localhost:${env.port}`);
  });
}

start();

module.exports = app;
