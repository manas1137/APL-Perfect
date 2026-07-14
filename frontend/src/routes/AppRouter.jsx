import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { SiteAuthProvider } from "../context/SiteAuthContext";
import { DataRefreshProvider } from "../context/DataRefreshContext";
import { ROUTES } from "../constants";
import LoginSelection from "../pages/auth/LoginSelection";
import AdminLogin from "../pages/auth/AdminLogin";
import SiteLogin from "../pages/auth/SiteLogin";
import Dashboard from "../pages/dashboard/Dashboard";
import Workers from "../pages/workers/Workers";
import Materials from "../pages/materials/Materials";
import Sites from "../pages/sites/Sites";
import SiteDetailPage from "../pages/sites/SiteDetailPage";
import Requests from "../pages/requests/Requests";
import Notifications from "../pages/notifications/Notifications";
import NotFound from "../pages/NotFound";
import ServerError from "../pages/ServerError";
import {
  SiteDashboard,
  Attendance,
  PaymentRequest,
  MaterialRequest,
  SiteExpenses,
  ExpenseDetails,
  SiteDetails,
  RequestHistory,
  SiteNotifications,
} from "../pages/site";
import AttendanceHistory from "../pages/admin/AttendanceHistory";
import ExpenseHistory from "../pages/admin/ExpenseHistory";
import { AdminLayout, SiteLayout } from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import SiteProtectedRoute from "./SiteProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SiteAuthProvider>
            <DataRefreshProvider>
              <Routes>
              <Route path="/" element={<Navigate to="/auth" />} />
              <Route path="/auth" element={<LoginSelection />} />
              <Route path="/auth/login" element={<AdminLogin />} />
              <Route path="/auth/site-login" element={<SiteLogin />} />
              <Route path="/500" element={<ServerError />} />
              
              <Route path={ROUTES.DASHBOARD} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.WORKERS} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Workers />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.MATERIALS} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Materials />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.SITES} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Sites />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/sites/:id" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <SiteDetailPage />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.REQUESTS} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Requests />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.EXPENSE_HISTORY} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ExpenseHistory />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path={ROUTES.NOTIFICATIONS} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Notifications />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path={ROUTES.ATTENDANCE_HISTORY} element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AttendanceHistory />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="/site/dashboard" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <SiteDashboard />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path="/site/attendance" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <Attendance />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path="/site/payment" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <PaymentRequest />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path="/site/material" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <MaterialRequest />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path="/site/expenses" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <SiteExpenses />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path="/site/expenses/:id" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <ExpenseDetails />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />

              <Route path="/site/details" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <SiteDetails />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />

              <Route path="/site/request-history" element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <RequestHistory />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              <Route path={ROUTES.SITE_NOTIFICATIONS} element={
                <SiteProtectedRoute>
                  <SiteLayout>
                    <SiteNotifications />
                  </SiteLayout>
                </SiteProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            </DataRefreshProvider>
          </SiteAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
