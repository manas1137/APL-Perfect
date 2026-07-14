# APL Perfect — Backend

Express + MongoDB backend for the APL Perfect construction management system. Built with clean architecture principles, ES Modules, and production-ready security middleware.

---

## Backend Overview

The backend serves as the API layer for the APL Perfect construction management system. It handles authentication for both admin users and site incharges, manages CRUD operations for workers/materials/sites, and orchestrates the request approval workflow for attendance, material, payment, and other requests.

### Key Capabilities
- Dual authentication: Admin JWT auth + Site JWT auth
- Request approval workflow with admin remarks
- Notification system for real-time updates
- Attendance tracking with worker-wise status
- Material and payment request management
- Dashboard analytics with aggregation pipelines
- Winston logging with MongoDB transport
- Security hardening via Helmet, rate limiting, and CORS

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| **Node.js** | Runtime environment |
| **Express 4** | Web framework |
| **Mongoose 8** | MongoDB ODM |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **helmet** | Security headers |
| **cors** | Cross-origin resource sharing |
| **express-rate-limit** | Brute-force protection |
| **cookie-parser** | Cookie parsing |
| **compression** | Response compression |
| **winston** | Application logging |
| **winston-mongodb** | MongoDB log transport |
| **dotenv** | Environment variables |
| **nodemon** | Development server |
| **express-validator** | Request validation |

---

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/               # Request handlers
│   │   ├── authController.js      # Admin login/logout
│   │   ├── siteAuthController.js  # Site login/logout
│   │   ├── workerController.js    # Worker CRUD
│   │   ├── materialController.js  # Material CRUD
│   │   ├── siteController.js      # Site CRUD, stats, assigned workers
│   │   ├── attendanceController.js # Attendance submission + history
│   │   ├── materialRequestController.js # Material request workflow
│   │   ├── paymentRequestController.js  # Payment request workflow
│   │   ├── otherRequestController.js    # Other request workflow
│   │   ├── dashboardController.js       # Dashboard analytics
│   │   └── notificationController.js    # Notification CRUD + read status
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + authorize middleware
│   │   ├── siteProtect.js         # Site JWT protect middleware
│   │   ├── security.js            # Helmet, rate limiting, CORS
│   │   ├── error.js               # Centralized error handler
│   │   └── notFound.js            # 404 handler
│   ├── models/                    # Mongoose schemas
│   │   ├── Admin.js               # Admin users
│   │   ├── Site.js                # Construction sites
│   │   ├── Worker.js              # Workers assigned to sites
│   │   ├── Material.js            # Material catalog
│   │   ├── Attendance.js          # Daily attendance records
│   │   ├── MaterialRequest.js     # Material request submissions
│   │   ├── PaymentRequest.js      # Payment request submissions
│   │   ├── OtherRequest.js        # Miscellaneous requests
│   │   └── Notification.js        # System notifications
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js          # Admin auth routes
│   │   ├── siteAuthRoutes.js      # Site auth routes
│   │   ├── workerRoutes.js        # Worker routes
│   │   ├── materialRoutes.js      # Material routes
│   │   ├── siteRoutes.js          # Site routes
│   │   ├── siteAdminRoutes.js     # Site admin routes
│   │   ├── attendanceRoutes.js    # Attendance routes
│   │   ├── materialRequestRoutes.js # Material request routes
│   │   ├── paymentRequestRoutes.js  # Payment request routes
│   │   ├── otherRequestRoutes.js    # Other request routes
│   │   ├── dashboardRoutes.js       # Dashboard routes
│   │   └── notificationRoutes.js    # Notification routes
│   ├── services/                  # Business logic layer
│   │   ├── authService.js         # Admin auth logic
│   │   ├── siteAuthService.js     # Site auth logic
│   │   ├── workerService.js       # Worker operations
│   │   ├── materialService.js     # Material operations
│   │   ├── siteService.js         # Site operations + stats
│   │   ├── attendanceService.js   # Attendance operations
│   │   ├── materialRequestService.js # Material request logic
│   │   ├── paymentRequestService.js  # Payment request logic
│   │   ├── otherRequestService.js    # Other request logic
│   │   ├── dashboardService.js       # Dashboard aggregations
│   │   └── notificationService.js    # Notification logic
│   ├── utils/
│   │   ├── ApiError.js            # Custom error class
│   │   ├── ApiResponse.js         # Standardized response helper
│   │   ├── asyncHandler.js         # Express async wrapper
│   │   ├── env.js                  # Env validation
│   │   ├── generateToken.js        # JWT generation
│   │   └── logger.js               # Winston logger config
│   ├── validations/               # Express-validator schemas
│   │   ├── authValidation.js
│   │   ├── siteAuthValidation.js
│   │   ├── workerValidation.js
│   │   ├── materialValidation.js
│   │   ├── siteValidation.js
│   │   ├── attendanceValidation.js
│   │   ├── materialRequestValidation.js
│   │   ├── paymentRequestValidation.js
│   │   └── otherRequestValidation.js
│   ├── app.js                     # Express app setup
│   └── server.js                   # Entry point
├── uploads/                        # Uploaded files
├── .env                            # Environment variables
├── .gitignore
└── package.json
```

---

## Architecture

```
Request Flow:
Client → Route → Middleware (auth/validation) → Controller → Service → Model → MongoDB

Response Flow:
MongoDB → Model → Service → Controller → ApiResponse → Client
```

### Layers
- **Routes**: Define endpoints, apply middleware, map to controllers
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Business logic, database operations, data transformation
- **Models**: Mongoose schemas, validation, indexes, methods
- **Middleware**: Auth, validation, security, error handling
- **Utils**: Shared helpers for responses, errors, logging, tokens

---

## Database Design

### Collections

| Collection | Purpose |
|------------|---------|
| `admins` | Admin user accounts |
| `sites` | Construction site master data |
| `workers` | Worker roster |
| `materials` | Material catalog |
| `attendances` | Daily attendance submissions |
| `materialrequests` | Material request submissions |
| `paymentrequests` | Payment request submissions |
| `otherrequests` | Miscellaneous requests |
| `notifications` | System notifications |

### Key Relationships
- **Site** → many **Workers** (via `assignedWorkers` array)
- **Site** → many **Attendance** records
- **Site** → many **MaterialRequest** records
- **Site** → many **PaymentRequest** records
- **Site** → many **OtherRequest** records
- **Site** → many **Notification** records
- **MaterialRequest** → many **Material** items (embedded)

---

## Models

### Admin
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `username` | String | Unique login username |
| `email` | String | Unique email address |
| `password` | String | Bcrypt hashed (excluded from queries) |
| `role` | String | Enum: `["admin"]` |

### Site
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Unique site name |
| `ownerName` | String | Site incharge name |
| `ownerMobile` | String | 10-digit mobile number |
| `ownerEmail` | String | Optional email |
| `budget` | Number | Project budget |
| `originalBudget` | Number | Initial budget reference |
| `location` | String | Site address |
| `password` | String | Bcrypt hashed (excluded from queries) |
| `assignedWorkers` | [ObjectId] | References to Worker collection |
| `isActive` | Boolean | Soft delete flag |
| `stats` | Object | Cached stats (workers, attendance, requests) |

### Worker
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Worker full name |
| `esiNumber` | String | Unique ESI number |
| `pfNumber` | String | Unique PF number |
| `mobileNumber` | String | 10-digit mobile with regex validation |
| `isActive` | Boolean | Active/inactive status |

### Material
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Material name |
| `unitPrice` | Number | Price per unit |
| `unit` | String | Enum: kg, liter, piece, bag, meter, sqft, cubic_feet, ton, dozen, other |
| `note` | String | Optional description |
| `isActive` | Boolean | Active/inactive status |

### Attendance
| Field | Type | Description |
|-------|------|-------------|
| `siteId` | ObjectId | Reference to Site |
| `date` | Date | Attendance date (unique per site) |
| `totalWorkers` | Number | Total workers count |
| `workers` | Array | Worker-wise attendance [{workerId, name, status}] |
| `note` | String | Optional remarks |
| `submittedBy` | String | Submitted by name |
| `submittedAt` | Date | Submission timestamp |
| `status` | String | Enum: pending, approved, rejected |
| `reviewedBy` | String | Admin name |
| `reviewedAt` | Date | Review timestamp |
| `adminRemark` | String | Admin remarks |

### MaterialRequest
| Field | Type | Description |
|-------|------|-------------|
| `siteId` | ObjectId | Reference to Site |
| `date` | Date | Request date |
| `note` | String | Optional remarks |
| `materials` | Array | [{materialId, name, quantity, unit, price}] |
| `status` | String | Enum: pending, approved, rejected |
| `reviewedBy` | String | Admin name |
| `reviewedAt` | Date | Review timestamp |
| `adminRemark` | String | Admin remarks |

### PaymentRequest
| Field | Type | Description |
|-------|------|-------------|
| `siteId` | ObjectId | Reference to Site |
| `date` | Date | Request date |
| `purpose` | String | Payment purpose |
| `requestedBy` | String | Requester name |
| `siteLocation` | String | Site location at time of request |
| `amount` | Number | Payment amount |
| `note` | String | Optional details |
| `status` | String | Enum: pending, approved, rejected |
| `reviewedBy` | String | Admin name |
| `reviewedAt` | Date | Review timestamp |
| `adminRemark` | String | Admin remarks |

### OtherRequest
| Field | Type | Description |
|-------|------|-------------|
| `siteId` | ObjectId | Reference to Site |
| `purpose` | String | Request subject |
| `note` | String | Description |
| `mobileNumber` | String | Contact mobile |
| `status` | String | Enum: pending, approved, rejected |
| `reviewedBy` | String | Admin name |
| `reviewedAt` | Date | Review timestamp |
| `adminRemark` | String | Admin remarks |

### Notification
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Notification title |
| `message` | String | Notification body |
| `type` | String | Enum: attendance, payment, material, other, system |
| `siteId` | ObjectId | Reference to Site |
| `siteName` | String | Denormalized site name |
| `isRead` | Boolean | Read/unread status |

---

## Controllers

| Controller | Responsibilities |
|------------|-----------------|
| `authController` | Admin login, logout |
| `siteAuthController` | Site login, logout |
| `workerController` | Worker CRUD operations |
| `materialController` | Material CRUD operations |
| `siteController` | Site CRUD, stats, assigned workers, materials list |
| `attendanceController` | Attendance submission, retrieval |
| `materialRequestController` | Material request submit, history, approve, reject |
| `paymentRequestController` | Payment request submit, history, approve, reject |
| `otherRequestController` | Other request submit, history, approve, reject |
| `dashboardController` | Admin and site dashboard aggregations |
| `notificationController` | Notification CRUD, read/unread, delete |

---

## Routes

### Admin Routes (`/api/...`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Admin login |
| `POST` | `/api/auth/logout` | Admin | Admin logout |
| `GET` | `/api/dashboard` | Admin | Dashboard stats |
| `GET` | `/api/workers` | Admin | List workers |
| `POST` | `/api/workers/add` | Admin | Create worker |
| `PUT` | `/api/workers/:id` | Admin | Update worker |
| `DELETE` | `/api/workers/:id` | Admin | Delete worker |
| `GET` | `/api/materials` | Admin | List materials |
| `POST` | `/api/materials/add` | Admin | Create material |
| `PUT` | `/api/materials/:id` | Admin | Update material |
| `DELETE` | `/api/materials/:id` | Admin | Delete material |
| `GET` | `/api/sites` | Admin | List sites |
| `POST` | `/api/sites` | Admin | Create site |
| `GET` | `/api/sites/:id` | Admin | Get site details |
| `PUT` | `/api/sites/:id` | Admin | Update site |
| `DELETE` | `/api/sites/:id` | Admin | Delete site |
| `GET` | `/api/sites/:id/stats` | Admin | Site statistics |
| `GET` | `/api/sites/:id/assigned-workers` | Admin | Site assigned workers |
| `GET` | `/api/attendance` | Admin | List attendance |
| `GET` | `/api/attendance/:id` | Admin | Attendance detail |
| `GET` | `/api/payment-request` | Admin | List payment requests |
| `PATCH` | `/api/payment-request/:id/approve` | Admin | Approve payment |
| `PATCH` | `/api/payment-request/:id/reject` | Admin | Reject payment |
| `GET` | `/api/material-request` | Admin | List material requests |
| `PATCH` | `/api/material-request/:id/approve` | Admin | Approve material request |
| `PATCH` | `/api/material-request/:id/reject` | Admin | Reject material request |
| `GET` | `/api/other-request` | Admin | List other requests |
| `PATCH` | `/api/other-request/:id/approve` | Admin | Approve other request |
| `PATCH` | `/api/other-request/:id/reject` | Admin | Reject other request |
| `GET` | `/api/notifications` | Admin | List notifications |
| `GET` | `/api/notifications/:id` | Admin | Notification detail |
| `PATCH` | `/api/notifications/:id/read` | Admin | Mark as read |
| `PATCH` | `/api/notifications/read-all` | Admin | Mark all read |
| `DELETE` | `/api/notifications/:id` | Admin | Delete notification |
| `DELETE` | `/api/notifications` | Admin | Delete all notifications |
| `GET` | `/api/attendance-history` | Admin | Cross-site attendance history |

### Site Routes (`/api/site/...`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/site/auth/login` | Public | Site login |
| `POST` | `/api/site/auth/logout` | Site | Site logout |
| `GET` | `/api/site/dashboard` | Site | Site dashboard |
| `GET` | `/api/site/details` | Site | Site profile |
| `GET` | `/api/site/assigned-workers` | Site | Assigned workers |
| `GET` | `/api/site/materials` | Site | Available materials |
| `POST` | `/api/site/attendance` | Site | Submit attendance |
| `GET` | `/api/site/attendance/history` | Site | Attendance history |
| `POST` | `/api/site/payment-request` | Site | Submit payment request |
| `GET` | `/api/site/payment-request/history` | Site | Payment history |
| `POST` | `/api/site/material-request` | Site | Submit material request |
| `GET` | `/api/site/material-request/history` | Site | Material request history |
| `POST` | `/api/site/other-request` | Site | Submit other request |
| `GET` | `/api/site/other-request/history` | Site | Other request history |
| `GET` | `/api/site/notifications` | Site | Site notifications |
| `PATCH` | `/api/site/notifications/:id/read` | Site | Mark notification read |
| `PATCH` | `/api/site/notifications/read-all` | Site | Mark all read |
| `DELETE` | `/api/site/notifications/:id` | Site | Delete notification |

---

## Services

| Service | Responsibilities |
|---------|-----------------|
| `authService` | Admin login validation, JWT generation |
| `siteAuthService` | Site login validation, JWT generation |
| `workerService` | Worker CRUD with search and pagination |
| `materialService` | Material CRUD with search and pagination |
| `siteService` | Site CRUD, budget management, assigned workers, stats |
| `attendanceService` | Attendance submission, retrieval, site/date validation |
| `materialRequestService` | Material request submit, history, approve/reject with remarks |
| `paymentRequestService` | Payment request submit, history, approve/reject with remarks |
| `otherRequestService` | Other request submit, history, approve/reject with remarks |
| `dashboardService` | Aggregation pipelines for admin and site dashboards |
| `notificationService` | Notification CRUD, read/unread, site notifications, dashboard notifications |

---

## Middleware

| Middleware | Purpose |
|------------|---------|
| `protect` | Verifies JWT from Authorization header or cookie, attaches `req.admin` |
| `authorize(...roles)` | Role-based access control for admin routes |
| `siteProtect` | Verifies site JWT, attaches `req.site` |
| `securityMiddleware` | Helmet CSP, rate limiting (auth: 10/15min, general: 100/15min) |
| `errorHandler` | Centralized error formatting with status codes |
| `notFoundHandler` | 404 response for undefined routes |

---

## Authentication

### Admin Authentication
- JWT tokens signed with `JWT_SECRET`
- Token expiry configurable via `JWT_EXPIRES` (default: 24h)
- Tokens sent via `Authorization: Bearer <token>` header or `token` cookie
- Password hashing with bcryptjs (10 salt rounds)
- Rate limited to 10 login attempts per 15 minutes

### Site Authentication
- Separate JWT flow for site users
- Tokens validated by `siteProtect` middleware
- Password hashing with bcryptjs
- Rate limited to 10 login attempts per 15 minutes

---

## Request Approval Workflow

All request types follow a consistent approval pattern:

1. **Site** submits request with status `pending`
2. **Admin** views request in `/requests` page
3. **Admin** clicks "View Details" to open request modal
4. **Admin** adds optional remark and clicks Approve/Reject
5. **Backend** updates `status`, `reviewedBy`, `reviewedAt`, `adminRemark`
6. **Notification** is created for the site with request update

Supported request types:
- **Attendance** — Daily attendance with worker-wise present/absent status
- **Material** — Material requirements with quantities and estimated prices
- **Payment** — Payment requests with amount, purpose, and location
- **Other** — Miscellaneous requests with subject and description

---

## Notification System

- Dual notification scopes: Admin notifications + Site-specific notifications
- Notification types: `attendance`, `payment`, `material`, `other`, `system`
- Features:
  - Mark as read / mark all as read
  - Delete individual notifications
  - Delete all notifications
  - Unread count tracking
  - Site-specific notification filtering
  - Dashboard latest notification feed

---

## Attendance System

- Sites submit daily attendance with worker-wise status (`present`/`absent`)
- Admin views cross-site attendance history with date filtering
- Attendance records support approval/rejection workflow
- Worker list includes name and status badge
- Present/absent counts calculated server-side

---

## Material Requests

- Sites submit material requirement requests
- Each request contains multiple material line items with:
  - Material reference, name, quantity, unit, unit price
  - Auto-calculated line totals and grand total
- Admin approves/rejects with remarks
- Full request history available to sites

---

## Payment Requests

- Sites submit payment requests with:
  - Purpose, amount, site location, requester name
  - Optional supporting notes
- Admin reviews with approve/reject + remark
- Status tracking in request history

---

## Other Requests

- Generic request type for miscellaneous needs
- Fields: purpose, note, mobile number
- Same approval workflow as other request types

---

## Dashboard APIs

### Admin Dashboard (`GET /api/dashboard`)
- Total sites, workers, materials counts
- Today's attendance breakdown (present/absent)
- Request statistics (pending/approved/rejected by type)
- Attendance graph data by site
- Request graph data by type and status
- Latest 5 notifications

### Site Dashboard (`GET /api/site/dashboard`)
- Assigned workers count
- Today's attendance (present/absent)
- Request counts by type and status
- Attendance graph data
- Request breakdown data

---

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aplperfect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES=24h
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Installation

```bash
cd backend
npm install
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server with Node |
| `npm run dev` | Start server with nodemon (auto-reload) |

---

## API Error Format

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Common Status Codes
| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not found |
| `500` | Server error |

---

## Security Features

- **Helmet** — Sets secure HTTP headers with CSP
- **CORS** — Configurable cross-origin policy
- **Rate Limiting** — Auth endpoints: 10 req/15min, General: 100 req/15min
- **bcryptjs** — Password hashing with salt rounds
- **JWT** — Stateless authentication with expiry
- **Input Validation** — express-validator on all mutation endpoints
- **Mongoose Sanitization** — Schema-level validation and type enforcement

---

## License

This project is licensed under the MIT License.

---

## Author

APL Perfect — Construction Management System
