# ShopHub — Production E-Commerce Application

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, React Router v6, Context API, Axios   |
| Backend   | Node.js, Express.js, Mongoose                   |
| Database  | MongoDB Atlas                                   |
| Auth      | JWT + bcryptjs                                  |
| Images    | Cloudinary                                      |
| Payments  | Stripe + Mock payment                           |
| Security  | Helmet, express-rate-limit, CORS                |

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary + Multer config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + role authorize
│   │   ├── errorMiddleware.js  # Centralized error handler
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   └── seeder.js           # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── Spinner.js
        │   │   └── Pagination.js
        │   ├── layout/
        │   │   ├── Navbar.js + Navbar.css
        │   │   └── Footer.js + Footer.css
        │   ├── products/
        │   │   └── ProductCard.js + ProductCard.css
        │   └── routing/
        │       ├── PrivateRoute.js
        │       └── AdminRoute.js
        ├── context/
        │   ├── AuthContext.js  # Global auth state
        │   └── CartContext.js  # Global cart state
        ├── pages/
        │   ├── HomePage.js
        │   ├── ProductsPage.js
        │   ├── ProductDetailPage.js
        │   ├── CartPage.js
        │   ├── CheckoutPage.js
        │   ├── OrdersPage.js
        │   ├── OrderDetailPage.js
        │   ├── ProfilePage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── NotFoundPage.js
        │   └── admin/
        │       ├── AdminDashboard.js
        │       ├── AdminProducts.js
        │       ├── AdminProductForm.js
        │       ├── AdminOrders.js
        │       └── AdminUsers.js
        ├── services/
        │   └── api.js          # Axios instance + all API calls
        ├── App.js
        ├── index.js
        └── index.css
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Stripe account (optional, mock payment available)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

**Required backend `.env` values:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

**Required frontend `.env` values:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- Admin: `admin@ecommerce.com` / `admin123`
- User: `john@example.com` / `password123`
- 5 sample products

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

App runs at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## API Documentation

### Authentication

| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/register  | Public  | Register new user  |
| POST   | /api/auth/login     | Public  | Login user         |
| GET    | /api/auth/me        | Private | Get current user   |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "password123" }
```

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "John Doe", "email": "...", "role": "user" }
}
```

---

### Products

| Method | Endpoint                    | Access       | Description              |
|--------|-----------------------------|--------------|--------------------------|
| GET    | /api/products               | Public       | Get all products (filter/paginate) |
| GET    | /api/products/featured      | Public       | Get featured products    |
| GET    | /api/products/:id           | Public       | Get single product       |
| POST   | /api/products               | Admin        | Create product           |
| PUT    | /api/products/:id           | Admin        | Update product           |
| DELETE | /api/products/:id           | Admin        | Delete product           |
| POST   | /api/products/:id/reviews   | Private      | Add/update review        |

**Query params for GET /api/products:**
```
?keyword=laptop&category=Electronics&minPrice=100&maxPrice=500&sort=-price&page=1&limit=12
```

---

### Cart

| Method | Endpoint            | Access  | Description           |
|--------|---------------------|---------|-----------------------|
| GET    | /api/cart           | Private | Get user's cart       |
| POST   | /api/cart           | Private | Add item to cart      |
| PUT    | /api/cart/:productId| Private | Update item quantity  |
| DELETE | /api/cart/:productId| Private | Remove item from cart |
| DELETE | /api/cart           | Private | Clear entire cart     |

---

### Orders

| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| POST   | /api/orders           | Private | Create order from cart   |
| GET    | /api/orders/my        | Private | Get user's orders        |
| GET    | /api/orders/:id       | Private | Get single order         |
| GET    | /api/orders           | Admin   | Get all orders           |
| PUT    | /api/orders/:id/pay   | Private | Mark order as paid       |
| PUT    | /api/orders/:id/status| Admin   | Update order status      |

---

### Payment

| Method | Endpoint                           | Access  | Description              |
|--------|------------------------------------|---------|--------------------------|
| POST   | /api/payment/create-payment-intent | Private | Create Stripe intent     |
| POST   | /api/payment/mock                  | Private | Mock payment (testing)   |
| POST   | /api/payment/webhook               | Public  | Stripe webhook handler   |

---

### Users (Admin)

| Method | Endpoint         | Access | Description        |
|--------|------------------|--------|--------------------|
| GET    | /api/users       | Admin  | Get all users      |
| GET    | /api/users/:id   | Admin  | Get user by ID     |
| PUT    | /api/users/:id   | Admin  | Update user role   |
| DELETE | /api/users/:id   | Admin  | Delete user        |
| PUT    | /api/users/profile/me | Private | Update own profile |

---

## Deployment Guide

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add all environment variables from `.env`
6. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add environment variables:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` = your Stripe key
5. Deploy

---

## Interview-Standout Improvements

Here are features that will make this project shine:

1. **Redis Caching** — Cache product listings and featured products to reduce DB load
2. **Email Notifications** — Send order confirmation emails via Nodemailer/SendGrid
3. **Wishlist Feature** — Let users save products for later
4. **Coupon/Discount System** — Admin creates coupon codes with percentage/fixed discounts
5. **Real-time Order Tracking** — WebSocket (Socket.io) for live order status updates
6. **Product Recommendations** — "Customers also bought" based on order history
7. **Advanced Analytics Dashboard** — Charts (Chart.js/Recharts) for revenue, top products, user growth
8. **PWA Support** — Add service worker for offline capability and installability
9. **Elasticsearch Integration** — Replace MongoDB text search with Elasticsearch for better search
10. **Docker + CI/CD** — Dockerize both services and add GitHub Actions pipeline
11. **Unit + Integration Tests** — Jest for backend, React Testing Library for frontend
12. **Refresh Token Rotation** — More secure auth with short-lived access tokens + refresh tokens
