# ShopSphere — Modern Full-Stack E-Commerce Platform

ShopSphere is an enterprise-grade, modern, and high-performance full-stack e-commerce web application built on the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS, Lucide icons, and Razorpay test payment integration.

Inspired by industry benchmarks like Amazon and Flipkart, ShopSphere combines a clean, premium user interface with an enterprise backend architecture, genuine database persistence, and a dedicated administrator operations dashboard.

---

## 🌟 Key Features

### 🛍️ Storefront & Customer Experience
- **Dynamic Modern Navigation**: Responsive navbar with category browser, instant search, wishlist indicator, cart counter badge, and responsive mobile drawer navigation.
- **Hero & Promotional Showcases**: Interactive slider banner, categorized quick links, trending deals, and best sellers.
- **Advanced Product Catalog**: Multi-criteria search and filtering by Category, Price Range, Minimum Rating, and Stock Availability with real-time sorting.
- **Comprehensive Product Details**: Multi-image thumbnail gallery, stock counters, specs table, verified customer ratings & reviews submission form.
- **Persistent Shopping Cart & Wishlist**: Real-time quantity steppers, coupon code application (try `SPHERE10`), automated tax and shipping calculations.
- **Streamlined Checkout**: Multiple saved delivery addresses, support for Cash on Delivery (COD) and Razorpay test checkout.
- **Customer Orders & Real-time Tracking**: Interactive fulfillment timeline (Processing → Confirmed → Shipped → Delivered), itemized receipts, and instant order cancellation for eligible orders.
- **User Profile Management**: Edit profile details, manage saved shipping addresses, and change security password.

### 🛡️ Secure Authentication & Authorization
- **JWT (JSON Web Token)** Bearer authentication with 30-day validity.
- **bcrypt.js** salt-based password encryption.
- Role-Based Access Control (RBAC) protecting customer and administrative routes.

### 📊 Comprehensive Admin Dashboard
- **Store Operations Overview**: Total Revenue, Total Orders, Total Customers, Products Catalog, and Low Stock Alerts.
- **Fulfillment Pipeline**: Track orders count by status (Processing, Confirmed, Shipped, Delivered, Cancelled).
- **Product Management (CRUD)**: Create, edit, and delete products, manage inventory stock, configure featured/trending badges, and upload images.
- **Order Management**: Filter orders by status and transition order lifecycle stages.
- **Customer Directory**: View registered customer profiles and activity timestamps.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React Icons, React Context API |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT, bcryptjs, Morgan, Multer, Cloudinary, Razorpay SDK |
| **Database** | MongoDB (Direct local daemon, MongoDB Atlas, or auto-configured in-process fallback engine) |

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@shopsphere.com` | `adminpassword123` | Storefront + Admin Dashboard (`/admin`) |
| **Demo Customer** | `alex@example.com` | `password123` | Storefront, Cart, Checkout, Order Tracking |

*(The login page also provides 1-Click quick login buttons for instant evaluation)*

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Clone & Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
*The backend automatically starts on `http://localhost:5000`. If an external MongoDB server is not running locally, it seamlessly launches an embedded database engine and auto-seeds the product catalog.*

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend Vite dev server will start on `http://localhost:5173` with automated API proxying to port 5000.*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new customer account
- `POST /api/auth/login` — Authenticate and return JWT token
- `GET /api/auth/me` — Get current authenticated user profile
- `PUT /api/auth/profile` — Update name, phone, and saved shipping addresses
- `PUT /api/auth/update-password` — Update user password

### Products & Categories (`/api/products`, `/api/categories`)
- `GET /api/categories` — Fetch all product categories
- `GET /api/products` — Filter products by `keyword`, `category`, `minPrice`, `maxPrice`, `rating`, `inStock`, and `sort`
- `GET /api/products/:id` — Get product details and verified reviews
- `POST /api/products/:id/reviews` — Submit review rating (1-5) and testimonial
- `POST /api/products` — Create product *(Admin only)*
- `PUT /api/products/:id` — Update product details and inventory *(Admin only)*
- `DELETE /api/products/:id` — Delete product *(Admin only)*

### Cart & Wishlist (`/api/cart`, `/api/wishlist`)
- `GET /api/cart` — Fetch user cart with subtotal and taxes
- `POST /api/cart` — Add item or increment quantity
- `PUT /api/cart/:productId` — Update item quantity
- `DELETE /api/cart/:productId` — Remove specific item
- `DELETE /api/cart` — Clear all items in cart
- `GET /api/wishlist` — Fetch saved wishlist products
- `POST /api/wishlist/toggle` — Toggle product in/out of wishlist

### Orders & Payments (`/api/orders`, `/api/payments`)
- `POST /api/orders` — Place order with shipping address & payment method (`COD` or `Razorpay`)
- `GET /api/orders/my-orders` — List authenticated user's order history
- `GET /api/orders/:id` — Order status details & fulfillment history
- `PUT /api/orders/:id/cancel` — Cancel pending order and restock inventory
- `POST /api/payments/razorpay-order` — Create Razorpay payment intent
- `POST /api/payments/razorpay-verify` — Verify cryptographic signature & confirm order

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard` — Revenue analytics, order metrics, and pipeline counts
- `GET /api/admin/orders` — View and filter all customer orders
- `PUT /api/admin/orders/:id` — Update fulfillment stage
- `GET /api/admin/users` — List registered customers

---

## 🧪 Automated End-to-End Tests

A complete automated E2E test suite is included:
```bash
node scratch/test_e2e.cjs
```
This tests all 12 core user and admin flows against the running application.

---

## 📄 License
MIT License. Built for modern, high-volume full-stack e-commerce.
