# Product Management — Client (React JS)

Pure React JS frontend (Create React App) for the Product Management app.
Reusable components, CSS Modules + global theme variables, Bootstrap grid,
and Font Awesome icons. Fully responsive.

## Prerequisites
- Node.js 18+
- The backend server running (see `../server`)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Set `REACT_APP_API_URL` to your backend URL (default `http://localhost:5000/api`).

3. **Run**
   ```bash
   npm start
   ```
   Opens `http://localhost:3000`.

4. **Production build**
   ```bash
   npm run build
   ```

## Default admin login
```
email:    admin@example.com
password: Admin@123
```

## Structure
```
src/
  api/         axios instance (auth + refresh interceptors) + API modules
  components/  reusable UI (CustomButton, CustomInput, CustomDropdown,
               CustomCard, Badge, Loader, Modal, Pagination, EmptyState,
               SearchBar, Navbar, Footer, ProductCard, Layout)
  context/     AuthContext
  pages/       Landing, ProductList, ProductDetails, Login, Register, NotFound
  pages/admin/ AdminLayout, Dashboard, AdminProductList, ProductForm, ProductView
  routes/      ProtectedRoute
  styles/      app.css (theme variables + gradient)
  utils/       storage (tokens), format (price/date)
```

## Screens
- **Landing** — hero + featured products
- **Products** — grid, search by name, filter by category, in-stock filter, pagination
- **Product details** — image gallery + full info
- **Login / Register** — JWT auth
- **Admin dashboard** — stat widgets + quick actions
- **Admin products** — table with **top-right add**, per-row **eye (view)** + **edit**
- **Create / Edit** — full product form
- **View** — read-only detail + **Delete (soft delete)** with confirmation modal

## Theming
All colors, gradients, spacing, radius and shadows live as CSS variables in
`src/styles/app.css`. Every component's `*.module.css` reads those variables,
so you can restyle the whole app by editing that one file.
