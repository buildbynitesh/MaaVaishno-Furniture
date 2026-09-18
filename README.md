# maaVaishno Furniture 🪑

A full-stack, production-ready luxury furniture e-commerce website.

**Tech Stack:** React + Vite + Tailwind CSS + Framer Motion | Node.js + Express.js + MongoDB Atlas + JWT + Razorpay

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Razorpay account (test keys from dashboard)

---

## 1. Clone & Install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## 2. Configure Environment

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/maaVaishno
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

---

## 3. Seed Database

```bash
cd server
node seeder.js
```

This creates:
- **Admin:** admin@maaVaishno.com / admin123
- **User:** user@demo.com / password123
- 7 products, 4 categories, 3 coupons

---

## 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

---

## 📂 Project Structure

```
maa-Vaishno-furniture/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # Reusable UI components
│       │   ├── hero/        # Hero slider
│       │   ├── navbar/      # Sticky navigation
│       │   ├── product/     # Product card, quick view
│       │   └── ui/          # Footer, shared UI
│       ├── layouts/         # MainLayout
│       ├── pages/           # All page components
│       │   └── admin/       # Admin dashboard
│       ├── redux/           # Redux Toolkit store + slices
│       ├── routes/          # Protected route wrappers
│       └── utils/           # Helpers, mock data
│
└── server/                  # Node.js + Express backend
    ├── config/              # MongoDB connection
    ├── controllers/         # Business logic
    ├── middleware/          # Auth, error handler, upload
    ├── models/              # Mongoose models
    ├── routes/              # Express routes
    ├── uploads/             # Static uploaded images
    ├── seeder.js            # Database seeder
    └── server.js            # Entry point
```

---

## 🛍️ Features

### Frontend
- ✅ Premium luxury UI (Beige/Wood/Cream palette)
- ✅ Animated hero slider (Framer Motion)
- ✅ Product cards with hover effects, quick view
- ✅ Redux cart with quantity controls & LocalStorage persistence
- ✅ Coupon code system (WELCOME10, SAVE20, MVF15)
- ✅ Wishlist with LocalStorage
- ✅ Shop page with filters, search, sort
- ✅ JWT authentication (login/signup)
- ✅ Protected routes
- ✅ Admin dashboard with product/order management
- ✅ Razorpay checkout integration
- ✅ Cash on Delivery option
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Dark mode toggle
- ✅ Toast notifications
- ✅ Skeleton loading states
- ✅ 14 fully designed pages

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB Atlas with Mongoose ODM
- ✅ JWT authentication with bcrypt
- ✅ Role-based access (user/admin)
- ✅ Razorpay order + payment verification
- ✅ Product search, filter, pagination
- ✅ Image upload with Multer
- ✅ Rate limiting (helmet + express-rate-limit)
- ✅ Error handling middleware
- ✅ Database seeder

---

## 💳 Razorpay Test Cards

| Card | Number | CVV | Expiry |
|------|--------|-----|--------|
| Visa | 4111 1111 1111 1111 | Any | Any future |
| Mastercard | 5267 3181 8797 5449 | Any | Any future |

Test UPI: success@razorpay

---

## 🏗️ Production Build

```bash
# Build client
cd client && npm run build

# Set NODE_ENV=production in server/.env
# The Express server will serve the React build
cd server && npm start
```

---

## 🎟️ Available Coupon Codes

| Code | Discount | Min Order |
|------|----------|-----------|
| WELCOME10 | 10% off | ₹2,000 |
| SAVE20 | 20% off | ₹10,000 |
| MVF15 | 15% off | ₹5,000 |

---

Made with ❤️ for maaVaishno Furniture
