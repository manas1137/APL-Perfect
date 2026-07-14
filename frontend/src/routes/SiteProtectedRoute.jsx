import { useSiteAuth } from "../context/SiteAuthContext";
import { Navigate, useLocation } from "react-router-dom";

const SiteProtectedRoute = ({ children }) => {
  const { site, isLoading } = useSiteAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-secondary-900">
        <div className="text-secondary-600 dark:text-secondary-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!site) {
    return <Navigate to="/auth/site-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default SiteProtectedRoute;
