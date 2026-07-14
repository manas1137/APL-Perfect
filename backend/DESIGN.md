# APL Perfect - Backend Design Document

## 1. Database Design

### Collections

1. **admins** - Admin users who manage the system
2. **workers** - Workers across all sites
3. **materials** - Materials catalog
4. **sites** - Construction sites
5. **attendances** - Daily attendance records
6. **paymentRequests** - Payment requests from site incharges
7. **materialRequests** - Material requests from site incharges
8. **otherRequests** - Misc requests from site incharges
9. **notifications** - Notifications for admin

---

## 2. ER Diagram (Text Format)

```
admin (1) --------< (N) site
admin (1) --------< (N) notification

site (1) --------< (N) worker

worker (1) --------< (N) attendance
worker (1) --------< (N) site (assigned_sites)

site (1) --------< (N) attendance
site (1) --------< (N) paymentRequest
site (1) --------< (N) materialRequest
site (1) --------< (N) otherRequest
site (1) --------< (N) materialRequest

material (1) --------< (N) materialRequest
```

---

## 3. MongoDB Collections

### 3.1 admins
```json
{
  "_id": "ObjectId",
  "username": "String (unique, required)",
  "email": "String (unique, required)",
  "password": "String (hashed, required)",
  "role": "String (enum: ['admin'], default: 'admin')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.2 workers
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "esiNumber": "String (unique, required)",
  "pfNumber": "String (unique, required)",
  "mobileNumber": "String (required)",
  "isActive": "Boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.3 materials
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "unitPrice": "Number (required)",
  "unit": "String (required, enum: ['kg', 'liter', 'piece', 'bag', 'meter', 'sqft', 'cubic_feet', 'ton', 'dozen', 'other'])",
  "note": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.4 sites
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "owner": "String (required)",
  "budget": "Number (required)",
  "location": "String (required)",
  "password": "String (required)",
  "assignedWorkers": [{"type": "ObjectId", "ref": "worker"}],
  "isActive": "Boolean (default: true)",
  "stats": {
    "totalWorkers": "Number (default: 0)",
    "totalPresentToday": "Number (default: 0)",
    "totalAbsentToday": "Number (default: 0)",
    "pendingRequests": "Number (default: 0)"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.5 attendances
```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId (ref: site, required)",
  "date": "Date (required)",
  "totalWorkers": "Number (required)",
  "workers": [
    {
      "workerId": "ObjectId (ref: worker)",
      "name": "String",
      "status": "String (enum: ['present', 'absent'], default: 'absent')"
    }
  ],
  "note": "String",
  "submittedBy": "String",
  "submittedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Unique Index:** { siteId: 1, date: 1 } (unique)

### 3.6 paymentRequests
```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId (ref: site, required)",
  "date": "Date (required)",
  "purpose": "String (required)",
  "requestedBy": "String (required)",
  "siteLocation": "String (required)",
  "amount": "Number (required)",
  "note": "String",
  "status": "String (enum: ['pending', 'approved', 'rejected'], default: 'pending')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.7 materialRequests
```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId (ref: site, required)",
  "date": "Date (required)",
  "note": "String",
  "materials": [
    {
      "materialId": "ObjectId (ref: material)",
      "name": "String",
      "unit": "String",
      "price": "Number"
    }
  ],
  "status": "String (enum: ['pending', 'approved', 'rejected'], default: 'pending')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.8 otherRequests
```json
{
  "_id": "ObjectId",
  "siteId": "ObjectId (ref: site, required)",
  "purpose": "String (required)",
  "note": "String",
  "mobileNumber": "String (required)",
  "status": "String (enum: ['pending', 'approved', 'rejected'], default: 'pending')",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.9 notifications
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "message": "String (required)",
  "type": "String (enum: ['attendance', 'payment', 'material', 'other', 'system'], required)",
  "siteId": "ObjectId (ref: site, required)",
  "siteName": "String (required)",
  "isRead": "Boolean (default: false)",
  "createdAt": "Date"
}
```

---

## 4. Mongoose Models

### Admin Model
```javascript
{
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['admin'], default: 'admin' }
}
```

### Worker Model
```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  esiNumber: { type: String, required: true, unique: true, trim: true },
  pfNumber: { type: String, required: true, unique: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true, match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'] },
  isActive: { type: Boolean, default: true }
}
```

### Material Model
```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  unitPrice: { type: Number, required: true, min: [0, 'Unit price cannot be negative'] },
  unit: { type: String, required: true, enum: ['kg', 'liter', 'piece', 'bag', 'meter', 'sqft', 'cubic_feet', 'ton', 'dozen', 'other'] },
  note: { type: String, trim: true, maxlength: 500 }
}
```

### Site Model
```javascript
{
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  owner: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  budget: { type: Number, required: true, min: [0, 'Budget cannot be negative'] },
  location: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
  password: { type: String, required: true, minlength: 4 },
  assignedWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  isActive: { type: Boolean, default: true },
  stats: {
    totalWorkers: { type: Number, default: 0 },
    totalPresentToday: { type: Number, default: 0 },
    totalAbsentToday: { type: Number, default: 0 },
    pendingRequests: { type: Number, default: 0 }
  }
}
```

### Attendance Model
```javascript
{
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  date: { type: Date, required: true },
  totalWorkers: { type: Number, required: true, min: 0 },
  workers: [{
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'absent' }
  }],
  note: { type: String, trim: true, maxlength: 500 },
  submittedBy: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}
```

### PaymentRequest Model
```javascript
{
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  date: { type: Date, required: true },
  purpose: { type: String, required: true, trim: true, maxlength: 200 },
  requestedBy: { type: String, required: true, trim: true },
  siteLocation: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: [0, 'Amount cannot be negative'] },
  note: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}
```

### MaterialRequest Model
```javascript
{
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  date: { type: Date, required: true },
  note: { type: String, trim: true, maxlength: 500 },
  materials: [{
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}
```

### OtherRequest Model
```javascript
{
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  purpose: { type: String, required: true, trim: true, maxlength: 200 },
  note: { type: String, trim: true, maxlength: 500 },
  mobileNumber: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}
```

### Notification Model
```javascript
{
  title: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 500 },
  type: { type: String, enum: ['attendance', 'payment', 'material', 'other', 'system'], required: true },
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  siteName: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false }
}
```

---

## 5. Relationships

| Source | Target | Type | Field | Notes |
|--------|--------|------|-------|-------|
| admin | site | 1:N | - | One admin can manage multiple sites |
| site | worker | N:N | assignedWorkers | Many workers can be assigned to multiple sites |
| site | attendance | 1:N | siteId | One site has multiple attendance records |
| site | paymentRequest | 1:N | siteId | One site has multiple payment requests |
| site | materialRequest | 1:N | siteId | One site has multiple material requests |
| site | otherRequest | 1:N | siteId | One site has multiple other requests |
| site | notification | 1:N | siteId | One site can generate multiple notifications |
| worker | attendance | 1:N | - | One worker can have multiple attendance records |
| material | materialRequest | 1:N | - | One material can appear in multiple requests |

---

## 6. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── workerController.js
│   │   ├── materialController.js
│   │   ├── siteController.js
│   │   ├── attendanceController.js
│   │   ├── requestController.js
│   │   └── notificationController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorMiddleware.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Worker.js
│   │   ├── Material.js
│   │   ├── Site.js
│   │   ├── Attendance.js
│   │   ├── PaymentRequest.js
│   │   ├── MaterialRequest.js
│   │   ├── OtherRequest.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── workerRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── siteRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── requestRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── workerService.js
│   │   ├── materialService.js
│   │   ├── siteService.js
│   │   ├── attendanceService.js
│   │   ├── requestService.js
│   │   └── notificationService.js
│   │
│   ├── validations/
│   │   ├── authValidation.js
│   │   ├── workerValidation.js
│   │   ├── materialValidation.js
│   │   ├── siteValidation.js
│   │   ├── attendanceValidation.js
│   │   └── requestValidation.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/
├── .env
└── package.json
```

---

## 7. Authentication Flow

```
1. Admin submits username/email + password to /api/auth/login
2. Backend validates credentials (bcrypt compare)
3. If valid, generate JWT token (24h expiry)
4. Set JWT in HTTP-only cookie
5. Return admin data (excluding password)
6. All protected routes validate JWT via middleware
7. On logout, clear cookie
```

### JWT Token Payload
```json
{
  "id": "adminObjectId",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890 + 86400
}
```

---

## 8. Authorization Flow

```
1. Client sends request with JWT cookie or Authorization header
2. authMiddleware extracts and validates JWT
3. If token invalid/missing → 401 Unauthorized
4. If valid, attach admin to req.admin
5. Proceed to controller
6. Role-based checks (admin only) handled in authMiddleware
7. Protected routes only accessible after auth
```

---

## 9. Complete REST API List

### AUTH
- POST /api/auth/login - Admin login

### DASHBOARD
- GET /api/dashboard/stats - Get dashboard statistics
- GET /api/dashboard/analytics - Get analytics data

### WORKERS
- POST /api/workers/add - Add worker
- GET /api/workers - Get all workers
- GET /api/workers/:id - Get worker by ID
- SEARCH /api/workers?search=keyword - Search workers

### MATERIALS
- POST /api/materials/add - Add material
- GET /api/materials - Get all materials
- GET /api/materials/:id - Get material by ID
- SEARCH /api/materials?search=keyword - Search materials

### SITES
- POST /api/sites/create - Create site
- GET /api/sites - Get all sites
- GET /api/sites/:id - Get site by ID
- GET /api/sites/:id/details - Get full site details with workers
- DELETE /api/sites/:id - Delete site

### ATTENDANCE
- POST /api/attendance/submit - Submit attendance
- GET /api/attendance/history - Get attendance history (with date filter)
- GET /api/attendance/history?date=YYYY-MM-DD&siteId=xxx - Filtered history

### REQUESTS
- GET /api/requests - Get all requests (all types)
- GET /api/requests/payment - Payment requests
- GET /api/requests/material - Material requests
- GET /api/requests/other - Other requests

### NOTIFICATIONS
- GET /api/notifications - Get all notifications
- PATCH /api/notifications/:id/read - Mark as read
- PATCH /api/notifications/read-all - Mark all as read
- GET /api/notifications/unread-count - Get unread count

---

## 10. Request/Response JSON Structure

### Admin Login
**Request:**
```json
{
  "identifier": "username_or_email",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "_id": "...",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Create Site
**Request:**
```json
{
  "name": "Site A",
  "owner": "John Doe",
  "budget": 500000,
  "location": "123 Main St",
  "password": "site123",
  "assignedWorkers": ["workerId1", "workerId2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Site created successfully",
  "data": { ...site }
}
```

### Submit Attendance
**Request:**
```json
{
  "siteId": "...",
  "date": "2026-07-05",
  "totalWorkers": 3,
  "workers": [
    { "workerId": "...", "name": "Ravi", "status": "present" },
    { "workerId": "...", "name": "Kumar", "status": "absent" }
  ],
  "note": "All present except Kumar",
  "submittedBy": "Site Incharge Name"
}
```

### Material Request
**Request:**
```json
{
  "siteId": "...",
  "date": "2026-07-05",
  "note": "Need materials urgently",
  "materials": [
    { "materialId": "...", "name": "Cement", "unit": "bag", "price": 350 },
    { "materialId": "...", "name": "Sand", "unit": "cubic_feet", "price": 2000 }
  ]
}
```

### Notification Response
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "title": "New Attendance Submitted",
        "message": "Site A submitted attendance for 2026-07-05",
        "type": "attendance",
        "siteId": "...",
        "siteName": "Site A",
        "isRead": false,
        "createdAt": "2026-07-05T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 11. Validation Rules

### Auth
- identifier: required, min 3 chars
- password: required, min 6 chars

### Worker
- name: required, 2-50 chars
- esiNumber: required, unique, trimmed
- pfNumber: required, unique, trimmed
- mobileNumber: required, valid 10-digit Indian mobile (starts with 6-9)

### Material
- name: required, 2-100 chars
- unitPrice: required, >= 0
- unit: required, enum value
- note: optional, max 500 chars

### Site
- name: required, 2-100 chars
- owner: required, 2-50 chars
- budget: required, >= 0
- location: required, 5-200 chars
- password: required, min 4 chars
- assignedWorkers: array of ObjectIds

### Attendance
- siteId: required, valid ObjectId
- date: required, valid Date string
- totalWorkers: required, >= 0
- workers: required, array with minimum 1 item
- submittedBy: required, 2-50 chars

### Requests (Payment, Material, Other)
- All common fields: required except note
- Status: enum string (default: pending)

---

## 12. Error Handling Strategy

### APIResponse Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // optional validation errors
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate entry)
- 500: Internal Server Error

### Global Error Middleware
```javascript
errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}
```

---

## 13. Notification Flow

```
1. Site Incharge submits attendance/material/payment/other request
2. Controller creates notification record
3. Notification type determined by source (attendance, payment, material, other)
4. Admin sees notification in top navigation
5. Badge shows unread count
6. Admin can mark individual/all as read
7. Notification contains:
   - Title (e.g., "New Attendance Submitted")
   - Message (e.g., "Site A submitted attendance for 2026-07-05")
   - Type (for icon/badge color)
   - SiteId & SiteName (quick navigation)
```

---

## 14. Dashboard Data Flow

```
1. Admin opens Dashboard
2. Frontend calls GET /api/dashboard/stats
3. Service aggregates:
   a. Total Sites count
   b. Total Workers count
   c. Total Materials count
   d. Today's Attendance:
      - Sum totalPresentToday across all sites
      - Sum totalAbsentToday across all sites
   e. Pending Requests count:
      - Count all requests with status 'pending'
4. Return stats object
5. Frontend renders:
   - Statistics Cards (Total Sites, Total Workers, Total Materials, Pending Requests)
   - Graph 1: Attendance Dashboard (Present vs Absent)
   - Graph 2: Analytics (maybe request types breakdown)
```

### Stats Response
```json
{
  "success": true,
  "data": {
    "totalSites": 10,
    "totalWorkers": 50,
    "totalMaterials": 25,
    "totalPresentToday": 35,
    "totalAbsentToday": 15,
    "pendingRequests": 12,
    "attendanceBreakdown": {
      "siteWise": [
        { "siteName": "Site A", "present": 5, "absent": 2 },
        { "siteName": "Site B", "present": 3, "absent": 1 }
      ]
    }
  }
}
```

---

## Notes

- All timestamps will use UTC
- Password hashing: bcryptjs (10 rounds default)
- JWT expiry: 24 hours (configurable via JWT_EXPIRES)
- All API responses follow standard { success, message, data } format
- Soft delete NOT implemented for now (hard delete)
- No file uploads in this phase
- No pagination needed initially (data volume expected to be small)
