# APL Perfect

**APL Perfect** is a premium construction management system built with the MERN stack. It provides dual-portal access: a full-featured **Admin Dashboard** for managing sites, workers, materials, and approvals, and a **Site Portal** for site incharge to manage day-to-day operations including attendance, material requests, and payment tracking.

The UI features an animated video background, warm bronze/gold luxury theme, glass-morphism cards, and smooth Framer Motion animations for a modern, premium experience.

---

## Features

### Admin Features
- **Dashboard** — Real-time overview with stats, attendance graphs, request analytics, and latest notifications
- **Worker Management** — Add, edit, delete, and assign workers to sites with ESI/PF tracking
- **Material Management** — Manage material catalog with unit pricing and active/inactive status
- **Site Management** — Create and manage construction sites with budgets, locations, and assigned workers
- **Request Approval Workflow** — Review and approve/reject requests from site incharges with admin remarks
- **Attendance History** — View attendance submitted by all sites with present/absent breakdown
- **Notification Center** — Real-time notifications for all requests with read/unread status, delete, and mark-all-read
- **Request History** — Complete audit trail of all requests with status tracking

### Site Incharge Features
- **Site Dashboard** — Personal site stats, today's attendance, pending requests, and recent notifications
- **Attendance Management** — Submit daily attendance with worker-wise present/absent status
- **Material Requests** — Submit material requirement requests with quantities and estimated prices
- **Payment Requests** — Submit payment requests with purpose, amount, and supporting notes
- **Other Requests** — Submit miscellaneous requests with subject and description
- **Request History** — Track all submitted requests with approval status and admin remarks
- **Site Notifications** — Site-specific notifications for request updates
- **Site Details** — View assigned site information and worker roster

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Framer Motion 12 |
| **Backend** | Node.js, Express 4, ES Modules |
| **Database** | MongoDB with Mongoose 8 |
| **Authentication** | JWT (HTTP-only cookies + Bearer tokens) |
| **Security** | Helmet, CORS, Rate Limiting, bcryptjs |
| **Logging** | Winston + Winston MongoDB Transport |
| **Form Handling** | React Hook Form 7 |
| **Charts** | Chart.js + React-ChartJS-2 |
| **Notifications** | React Hot Toast |

---

## Project Structure

```
APL Perfect/
├── frontend/                 # React + Vite client application
│   ├── src/
│   │   ├── api/             # Axios API service modules
│   │   ├── components/      # Reusable UI components
│   │   ├── constants/       # Route and status constants
│   │   ├── context/         # React contexts (Auth, Theme, DataRefresh)
│   │   ├── hooks/           # Custom hooks (useApi)
│   │   ├── layouts/         # Layout wrappers (Admin, Site, Protected)
│   │   ├── pages/           # Page components
│   │   ├── routes/          # React Router configuration
│   │   ├── services/        # Frontend service layer
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # Utility functions
│   │   ├── index.css        # Tailwind + theme configuration
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets (videos, images)
│   └── package.json
├── backend/                  # Express + MongoDB server
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, security, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Helpers (ApiError, ApiResponse, logger)
│   │   ├── validations/     # Request validation schemas
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- npm or yarn

### Clone Repository
```bash
git clone <repository-url>
cd APL\ Perfect
```

### Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aplperfect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=24h
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Client runs at `http://localhost:5173`

### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

---

## Authentication

The application supports two authentication flows:

| Portal | Routes | Context | Storage |
|--------|--------|---------|---------|
| **Admin** | `/auth/login` | `AuthContext` | `localStorage` |
| **Site Incharge** | `/auth/site-login` | `SiteAuthContext` | `localStorage` |

- Admin credentials are validated against the `Admin` collection
- Site credentials are validated against the `Site` collection
- Both use JWT tokens with HTTP-only cookie support
- Protected routes use `ProtectedRoute` (admin) and `SiteProtectedRoute` (site) wrappers
- Rate limiting is applied on login endpoints (10 attempts per 15 minutes)

---

## API Overview

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/logout` | Admin logout |
| `GET` | `/api/dashboard` | Admin dashboard stats |
| `GET` | `/api/workers` | List workers |
| `POST` | `/api/workers/add` | Create worker |
| `PUT` | `/api/workers/:id` | Update worker |
| `DELETE` | `/api/workers/:id` | Delete worker |
| `GET` | `/api/materials` | List materials |
| `POST` | `/api/materials/add` | Create material |
| `PUT` | `/api/materials/:id` | Update material |
| `DELETE` | `/api/materials/:id` | Delete material |
| `GET` | `/api/sites` | List sites |
| `POST` | `/api/sites` | Create site |
| `PUT` | `/api/sites/:id` | Update site |
| `DELETE` | `/api/sites/:id` | Delete site |
| `GET` | `/api/attendance` | List attendance records |
| `GET` | `/api/attendance/:id` | Get attendance detail |
| `GET` | `/api/payment-request` | List payment requests |
| `PATCH` | `/api/payment-request/:id/approve` | Approve payment request |
| `PATCH` | `/api/payment-request/:id/reject` | Reject payment request |
| `GET` | `/api/material-request` | List material requests |
| `PATCH` | `/api/material-request/:id/approve` | Approve material request |
| `PATCH` | `/api/material-request/:id/reject` | Reject material request |
| `GET` | `/api/other-request` | List other requests |
| `PATCH` | `/api/other-request/:id/approve` | Approve other request |
| `PATCH` | `/api/other-request/:id/reject` | Reject other request |
| `GET` | `/api/notifications` | List notifications |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all as read |
| `DELETE` | `/api/notifications/:id` | Delete notification |
| `DELETE` | `/api/notifications` | Delete all notifications |
| `GET` | `/api/attendance-history` | Attendance history across sites |

### Site APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/site/auth/login` | Site login |
| `POST` | `/api/site/auth/logout` | Site logout |
| `GET` | `/api/site/dashboard` | Site dashboard stats |
| `GET` | `/api/site/details` | Site details |
| `GET` | `/api/site/assigned-workers` | Assigned workers list |
| `GET` | `/api/site/materials` | Available materials |
| `POST` | `/api/site/attendance` | Submit attendance |
| `GET` | `/api/site/attendance/history` | Attendance history |
| `POST` | `/api/site/payment-request` | Submit payment request |
| `GET` | `/api/site/payment-request/history` | Payment request history |
| `POST` | `/api/site/material-request` | Submit material request |
| `GET` | `/api/site/material-request/history` | Material request history |
| `POST` | `/api/site/other-request` | Submit other request |
| `GET` | `/api/site/other-request/history` | Other request history |
| `GET` | `/api/site/notifications` | Site notifications |
| `PATCH` | `/api/site/notifications/:id/read` | Mark site notification as read |
| `DELETE` | `/api/site/notifications/:id` | Delete site notification |

---

## Screenshots

> Screenshots will be added here.

---

## Future Improvements

- Multi-site admin dashboard with comparison analytics
- Advanced reporting with PDF/Excel export
- Push notifications for mobile devices
- SMS/Email alerts for approval status changes
- Advanced role-based access control (RBAC)
- Real-time collaboration features
- Mobile app (React Native)

---

## License

This project is licensed under the MIT License.

---

## Author

APL Perfect — Construction Management System
