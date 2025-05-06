import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermission,
  redirectPath = "/login"
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If permission is required and user doesn't have it, redirect
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect based on role
    let redirectTo = "/dashboard";
    if (user && user.role === "admin") redirectTo = "/admin";
    if (user && user.role === "instructor") redirectTo = "/instructor";
    
    return <Navigate to={redirectTo} replace />;
  }

  // If allowedRoles is provided and user role is not in allowedRoles, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && user && !hasRole(allowedRoles)) {
    // Redirect based on role
    let redirectTo = "/dashboard";
    if (user.role === "admin") redirectTo = "/admin";
    if (user.role === "instructor") redirectTo = "/instructor";
    
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
