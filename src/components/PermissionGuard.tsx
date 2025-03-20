
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

const PermissionGuard = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  fallback,
  redirectTo,
}: PermissionGuardProps) => {
  const { user, isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the single required permission
  const hasRequiredPermission = requiredPermission ? hasPermission(requiredPermission) : true;
  
  // Check if user has any of the required permissions
  const hasAnyRequiredPermission = requiredPermissions.length > 0 
    ? requiredPermissions.some(permission => hasPermission(permission))
    : true;

  if (!hasRequiredPermission || !hasAnyRequiredPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Default redirect based on user role if no specific redirectTo is provided
    if (!redirectTo && user) {
      const roleBasedRedirect = {
        admin: "/admin",
        instructor: "/instructor",
        learner: "/learner"
      }[user.role];
      
      if (roleBasedRedirect) {
        return <Navigate to={roleBasedRedirect} replace />;
      }
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
