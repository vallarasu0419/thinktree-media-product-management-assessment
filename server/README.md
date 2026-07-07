# Product Management — Server (Node.js + Express + MySQL)

REST API for the Product Management app: JWT auth (access + refresh rotation),
categories, and product CRUD with **soft delete only**.

## Prerequisites
- Node.js 18+
- MySQL 8.0.16+

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create the database** (imports schema + seed data)
   ```bash
   mysql -u root -p < schema.sql
   ```
   This creates the `product_management` database, all tables, the listing view,
   a default admin, categories, and sample products.

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MySQL password and JWT secrets.

4. **Run**
   ```bash
   npm start        # production-style
   npm run dev      # with nodemon (auto-reload)
   ```
   The API runs on `http://localhost:5000`.

## Default admin login
```
email:    admin@example.com
password: Admin@123
```

## API summary
Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/register` | public | Register user |
| POST | `/auth/login` | public | Login |
| POST | `/auth/refresh` | public | Rotate refresh token |
| POST | `/auth/logout` | public | Revoke refresh token |
| GET  | `/auth/me` | bearer | Current user |
| GET  | `/categories` | public | Active categories |
| GET  | `/products` | public | List (search/filter/paginate) |
| GET  | `/products/:slug` | public | Single product + gallery |
| GET  | `/products/id/:id` | admin | Single product by id (edit) |
| GET  | `/products/admin/stats` | admin | Dashboard stats |
| POST | `/products` | admin | Create |
| PUT  | `/products/:id` | admin | Update |
| DELETE | `/products/:id` | admin | Soft delete |

All responses use the shape `{ success, data, message }`.
