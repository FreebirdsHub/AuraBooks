# 📚 BookStore — Full-Stack MERN Bookstore Application

A full-featured, production-ready online bookstore built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The platform supports customer-facing shopping features and a complete admin panel, with integrated **Razorpay** payment processing, JWT authentication, and a RESTful API.

---

## ✨ Features

### 🛍️ Customer Features
- Browse and search books by category, title, or author
- Detailed book pages with descriptions, ratings, and reviews
- Shopping cart with quantity management
- Wishlist to save favourite books
- Secure checkout with **Razorpay** payment gateway
- Order history with status tracking
- User profile management

### 🔐 Authentication & Security
- JWT-based authentication with HTTP-only cookies
- User registration and login
- Role-based access control (`user` / `admin`)
- Protected routes on both client and server
- Helmet, CORS, and input validation middleware

### 🛠️ Admin Panel
- **Dashboard** — overview of sales and key metrics
- **Books** — full CRUD (create, read, update, delete) with image upload
- **Categories** — manage book categories
- **Orders** — view and update order statuses
- **Users** — manage registered users

### 🔧 Developer Experience
- Swagger UI API documentation at `/api-docs`
- Winston logging
- Morgan HTTP request logging (development)
- Seed scripts to populate the database with sample data

---

## 🛠️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations |
| Axios | HTTP client |
| Lucide React | Icon library |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Razorpay | Payment processing |
| Multer | File / image uploads |
| Nodemailer | Email notifications |
| Helmet | Security headers |
| Winston + Morgan | Logging |
| Swagger UI | API documentation |

---

## 📁 Project Structure

```
MCA_project/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── components/         # Shared UI components (Toast, Skeletons, etc.)
│       ├── constants/          # Route constants
│       ├── context/            # React contexts (Toast)
│       ├── features/           # Redux slices & auth pages (login, register)
│       ├── hooks/              # Custom React hooks
│       ├── layouts/            # MainLayout & AdminLayout
│       ├── pages/              # Page components
│       │   ├── Home.jsx
│       │   ├── Books.jsx
│       │   ├── BookDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Orders.jsx
│       │   ├── Profile.jsx
│       │   ├── Wishlist.jsx
│       │   └── admin/          # Admin panel pages
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminBooks.jsx
│       │       ├── AdminCategories.jsx
│       │       ├── AdminOrders.jsx
│       │       └── AdminUsers.jsx
│       ├── services/           # Axios API service functions
│       └── store/              # Redux store configuration
│
└── server/                     # Express backend
    └── src/
        ├── config/             # App configuration
        ├── controllers/        # Route handler logic
        ├── middlewares/        # Auth, error, validation middleware
        ├── models/             # Mongoose schemas
        │   ├── User.js
        │   ├── Book.js
        │   ├── Category.js
        │   ├── Cart.js
        │   ├── Order.js
        │   ├── Payment.js
        │   ├── Review.js
        │   └── Wishlist.js
        ├── routes/             # Express route definitions
        ├── services/           # Business logic services
        ├── utils/              # Helpers (AppError, etc.)
        ├── app.js              # Express app setup
        └── server.js           # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/FreebirdsHub/AuraBooks.git
cd AuraBooks
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173

# Razorpay (get keys from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Start the server:

```bash
npm run dev      # Development (nodemon)
npm start        # Production
```

### 3. Setup the Client

```bash
cd ../client
npm install
```

Create a `.env.development` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### 4. Seed the Database (Optional)

Populate the database with sample books, categories, and users:

```bash
cd server
node src/seed-more.js
```

---

## 🌐 API Endpoints

The full interactive API documentation is available at:
```
http://localhost:5000/api-docs
```

| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login & receive cookie |
| `POST /api/auth/logout` | Logout |
| `GET /api/books` | List all books (with filters) |
| `GET /api/books/:id` | Get book details |
| `GET /api/categories` | List all categories |
| `GET /api/cart` | Get user's cart |
| `POST /api/cart` | Add item to cart |
| `GET /api/wishlist` | Get user's wishlist |
| `POST /api/orders` | Place an order |
| `GET /api/orders` | Get user's orders |
| `POST /api/payments/order` | Create Razorpay order |
| `POST /api/payments/verify` | Verify payment |
| `POST /api/reviews/:bookId` | Submit a review |
| `GET /api/admin/...` | Admin-only routes |
| `GET /api/health` | Health check |

---

## 💳 Payment Integration

This project uses **Razorpay** for payment processing.

- Test keys can be obtained from the [Razorpay Dashboard](https://dashboard.razorpay.com/).
- Use Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-details/) to simulate transactions in development.
- The webhook endpoint at `POST /api/payments/webhook` handles payment confirmations.

---

## 📜 Available Scripts

### Server (`/server`)
| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start` | Start server in production mode |

### Client (`/client`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Built as an MCA academic project using the MERN stack.
