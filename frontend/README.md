# APL Perfect — Frontend

React + Vite client for the APL Perfect construction management system. Features a premium dark theme with warm bronze/gold accents, animated video backgrounds, glass-morphism cards, and smooth Framer Motion animations.

---

## Frontend Overview

The frontend is a single-page application (SPA) built with React 19 and Vite 8. It uses Tailwind CSS v4 for styling, Framer Motion for animations, and React Router v7 for navigation. The app serves two distinct user portals:

- **Admin Portal** — Full dashboard for site managers to oversee workers, materials, sites, requests, and notifications
- **Site Portal** — Self-service portal for site incharges to manage attendance, requests, and view site details

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| **React 19** | UI library |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Framer Motion 12** | Animation library |
| **React Router 7** | Client-side routing |
| **React Hook Form 7** | Form state management |
| **Axios** | HTTP client |
| **Chart.js + React-ChartJS-2** | Dashboard charts |
| **React Hot Toast** | Toast notifications |
| **React Icons** | Icon library |

---

## Folder Structure

```
frontend/
├── src/
│   ├── api/                    # Axios API service modules
│   │   ├── axios.js           # Axios instance with interceptors
│   │   ├── authApi.js         # Admin auth endpoints
│   │   ├── siteAuthApi.js     # Site auth endpoints
│   │   ├── attendanceApi.js   # Attendance endpoints
│   │   ├── dashboardApi.js    # Dashboard endpoints
│   │   ├── materialApi.js     # Material CRUD endpoints
│   │   ├── materialRequestApi.js # Material request endpoints
│   │   ├── notificationApi.js # Notification endpoints
│   │   ├── otherApi.js        # Other request endpoints
│   │   ├── paymentApi.js      # Payment request endpoints
│   │   ├── paymentRequestApi.js # Payment request endpoints
│   │   ├── siteApi.js         # Site endpoints
│   │   └── workerApi.js       # Worker endpoints
│   ├── assets/                 # Static images and SVGs
│   ├── components/             # Reusable UI components
│   │   ├── buttons/           # Button component with variants
│   │   ├── cards/             # Card container component
│   │   ├── charts/            # Dashboard chart components
│   │   ├── common/            # Dropdown, ErrorBoundary, LoadingSpinner, SearchBar, SkeletonLoader
│   │   ├── forms/             # Input, FormLayout, WorkerMultiSelect
│   │   ├── layout/            # Navbar, Sidebar, BottomNavigation, NotificationBell, ProfileMenu, ThemeToggle
│   │   ├── modals/            # Modal, ConfirmationDialog
│   │   └── tables/            # Table component with sorting and loading states
│   ├── constants/              # Route and status constants
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx    # Admin authentication state
│   │   ├── SiteAuthContext.jsx # Site authentication state
│   │   ├── ThemeContext.jsx   # Dark/light theme state
│   │   └── DataRefreshContext.jsx # Global data refresh trigger
│   ├── hooks/                  # Custom React hooks
│   │   └── useApi.js          # Generic API hook with loading/error states
│   ├── layouts/                # Page layout wrappers
│   │   ├── AdminLayout.jsx    # Admin shell (Navbar + Sidebar + BottomNav)
│   │   ├── SiteLayout.jsx     # Site shell (Navbar + Sidebar)
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedLayout.jsx
│   ├── pages/                  # Page components
│   │   ├── auth/              # LoginSelection, AdminLogin, SiteLogin, SplashScreen
│   │   ├── admin/             # AttendanceHistory
│   │   ├── dashboard/         # Dashboard
│   │   ├── materials/         # Materials
│   │   ├── notifications/     # Notifications
│   │   ├── requests/          # Requests (unified approval page)
│   │   ├── site/              # SiteDashboard, Attendance, PaymentRequest, MaterialRequest, OtherRequest, RequestHistory, SiteDetails, SiteNotifications
│   │   ├── sites/             # Sites, SiteDetailPage
│   │   └── workers/           # Workers
│   ├── routes/                 # React Router configuration
│   │   ├── AppRouter.jsx      # Main route definitions
│   │   ├── ProtectedRoute.jsx # Admin auth guard
│   │   └── SiteProtectedRoute.jsx # Site auth guard
│   ├── services/               # Frontend service layer
│   ├── styles/                 # Additional style files
│   ├── utils/                  # Utility functions
│   ├── index.css               # Tailwind imports and theme tokens
│   └── main.jsx                # React entry point
├── public/                     # Static assets
│   └── video/overlay.mp4       # Animated login background video
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## Components

| Component | Description |
|-----------|-------------|
| `Button` | Variants: primary, secondary, outline, ghost, danger. Sizes: sm, md, lg. |
| `Card` | Container with title, subtitle, action slot, and padding variants. |
| `Input` | Form input with label, error state, and validation styling. |
| `Table` | Data table with custom columns, loading skeleton, and empty state. |
| `SearchBar` | Debounced search input with clear button. |
| `Modal` | Animated modal with focus trap, escape-to-close, and scroll lock. |
| `ConfirmationDialog` | Confirmation dialog with overlay, confirm/cancel actions. |
| `DropdownMenu` | Context menu with keyboard and click-outside support. |
| `LoadingSpinner` | Animated loading indicator. |
| `SkeletonLoader` | Shimmer skeleton for tables and cards. |
| `ErrorBoundary` | React error boundary for graceful failure. |
| `BottomNavigation` | Mobile bottom nav with animated active indicator. |
| `Navbar` | Top navigation with menu toggle and user menu. |
| `Sidebar` | Collapsible sidebar navigation. |
| `NotificationBell` | Bell icon with unread badge and dropdown popup. |
| `ProfileMenu` | User profile dropdown with logout. |
| `ThemeToggle` | Dark/light mode toggle. |

---

## Pages

### Authentication Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/auth` | `LoginSelection` | Landing page with Admin/Site login choice |
| `/auth/login` | `AdminLogin` | Admin username/password login |
| `/auth/site-login` | `SiteLogin` | Site name/password login |

### Admin Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | `Dashboard` | Admin dashboard with stats, charts, and recent activity |
| `/workers` | `Workers` | Worker management (CRUD + assignment) |
| `/materials` | `Materials` | Material catalog management |
| `/sites` | `Sites` | Site management with search and pagination |
| `/sites/:id` | `SiteDetailPage` | Individual site details with workers, materials, requests tabs |
| `/requests` | `Requests` | Unified request approval page (attendance, material, payment, other) |
| `/notifications` | `Notifications` | Admin notification center with delete and mark-all-read |
| `/attendance-history` | `AttendanceHistory` | Cross-site attendance history with filters |

### Site Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/site/dashboard` | `SiteDashboard` | Site incharge dashboard |
| `/site/attendance` | `Attendance` | Daily attendance submission |
| `/site/material` | `MaterialRequest` | Material request submission |
| `/site/payment` | `PaymentRequest` | Payment request submission |
| `/site/other` | `OtherRequest` | Other request submission |
| `/site/request-history` | `RequestHistory` | Site request history with status tracking |
| `/site/details` | `SiteDetails` | Site profile and assigned workers |
| `/site/notifications` | `SiteNotifications` | Site-specific notifications |

---

## Contexts

| Context | Purpose |
|---------|---------|
| `AuthContext` | Admin user state, login/logout, localStorage persistence |
| `SiteAuthContext` | Site user state, login/logout, localStorage persistence |
| `ThemeContext` | Dark/light theme toggle with localStorage persistence |
| `DataRefreshContext` | Global refresh trigger to sync data across tabs |

---

## API Services

All API calls are centralized in `src/api/` using Axios instances with interceptors for:
- Automatic token attachment
- 401 redirect to login
- Error normalization

Key service modules:
- `authApi.js` — Admin login/logout
- `siteAuthApi.js` — Site login/logout
- `dashboardApi.js` — Dashboard data
- `workerApi.js` — Worker CRUD
- `materialApi.js` — Material CRUD
- `siteApi.js` — Site CRUD, stats, assigned workers, materials
- `attendanceApi.js` — Attendance submission, history, approval
- `paymentRequestApi.js` — Payment request submission, history, approval/rejection
- `materialRequestApi.js` — Material request submission, history, approval/rejection
- `otherApi.js` — Other request submission, history, approval/rejection
- `notificationApi.js` — Notification CRUD, read/unread, delete

---

## Routing

The app uses React Router v7 with the following route groups:

- **Public routes** — `/auth`, `/auth/login`, `/auth/site-login`, `/500`
- **Admin protected routes** — Wrapped in `ProtectedRoute` + `AdminLayout`
- **Site protected routes** — Wrapped in `SiteProtectedRoute` + `SiteLayout`
- **Catch-all** — `NotFound` page for 404s

---

## Theme Support

- **Dark mode** is the default and primary theme
- Warm bronze/gold color palette with premium glass-morphism effects
- Animated video backgrounds on authentication pages
- Smooth transitions via `transition-theme` utility class
- Theme state persisted in localStorage

---

## Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Bottom navigation for mobile admin view
- Collapsible sidebar for desktop
- Touch-friendly form inputs (min 44px tap targets)
- Responsive tables with horizontal scroll
- Adaptive spacing and typography across breakpoints

---

## How to Run

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint codebase
npm run lint
```

---

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build with optimizations |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |

---

## Dependencies

### Production
- `@tailwindcss/vite` ^4.3.2
- `axios` ^1.18.1
- `chart.js` ^4.5.1
- `framer-motion` ^12.42.2
- `react` ^19.2.7
- `react-chartjs-2` ^5.3.1
- `react-dom` ^19.2.7
- `react-hook-form` ^7.81.0
- `react-hot-toast` ^2.6.0
- `react-icons` ^5.7.0
- `react-router-dom` ^7.18.1
- `tailwindcss` ^4.3.2

### Development
- `@babel/core` ^7.29.7
- `@eslint/js` ^10.0.1
- `@rolldown/plugin-babel` ^0.2.3
- `@types/react` ^19.2.17
- `@types/react-dom` ^19.2.3
- `@vitejs/plugin-react` ^6.0.3
- `babel-plugin-react-compiler` ^1.0.0
- `eslint` ^10.6.0
- `eslint-plugin-react-hooks` ^7.1.1
- `eslint-plugin-react-refresh` ^0.5.3
- `globals` ^17.7.0
- `vite` ^8.1.1

---

## UI Features

- Animated video backgrounds on authentication pages
- Premium glass-morphism card effects with backdrop blur
- Warm bronze/gold color palette with dark construction theme
- Smooth page transitions and micro-interactions via Framer Motion
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Skeleton loading states for async data
- Responsive data tables with search and filtering
- Unread notification badges with real-time updates
- Dark mode optimized for low-light environments

---

## Authentication Flow

### Admin Flow
1. User navigates to `/auth`
2. Selects "Admin Login" → redirected to `/auth/login`
3. Enters username/email and password
4. `AuthContext.login()` calls `POST /api/auth/login`
5. On success, JWT stored in localStorage, user redirected to `/dashboard`
6. `ProtectedRoute` validates token on every admin page navigation
7. Logout clears token and redirects to `/auth/login`

### Site Flow
1. User navigates to `/auth`
2. Selects "Site Login" → redirected to `/auth/site-login`
3. Enters site name and password
4. `SiteAuthContext.login()` calls `POST /api/site/auth/login`
5. On success, site data stored in localStorage, user redirected to `/site/dashboard`
6. `SiteProtectedRoute` validates token on every site page navigation
7. Logout clears token and redirects to `/auth/site-login`
