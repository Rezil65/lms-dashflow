
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectPath = "/login"
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and user role is not in allowedRoles, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && user && !hasRole(allowedRoles)) {
    // Redirect based on role
    let redirectTo = "/";
    if (user.role === "admin") redirectTo = "/admin";
    if (user.role === "instructor") redirectTo = "/instructor";
    if (user.role === "learner") redirectTo = "/learner";
    
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
